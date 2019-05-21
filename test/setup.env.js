const url = require('url');

const testDev = () => {
    const before = (done) => {
        // fighting race condition with hot-reload builds
        setTimeout(done, 5000);
    };// (done) => { setTimeout(done, 1000); };
    const after = () => { };//(done) => { setTimeout(done, 1000); };
    const getApi = pathname => url.format({
        hostname: 'localhost',
        protocol: 'http',
        port: 3030,
        pathname
    });

    const getPage = getApi
    return { getPage, getApi, before, after };
};

const testStaging = () => {
    const before = () => { }
    const after = () => { }

    const getPage = pathname => url.format({
        hostname: 'incommong.dev',
        protocol: 'https',
        pathname: `/staging${pathname}`
    })

    const getApi = pathname => url.format({
        hostname: 'staging.incommon.dev',
        protocol: 'https',
        pathname,
    })

    return { getPage, getApi, before, after };
}

const testCI = (port) => {
    /* eslint-disable no-console */
    const logger = require('../server/logger');
    const app = require('../server/app');
    const nextApp = require('../server/nextApp').nextApp;

    const getApi = pathname => url.format({
        hostname: app.get('host') || 'localhost',
        protocol: 'http',
        port,
        pathname
    });

    const getPage = getApi

    let server = null;

    const before = async () => new Promise(resolve => {
        nextApp.prepare().then(() => {
            server = app.listen(port);

            process.on('unhandledRejection', (reason, p) =>
                logger.error('Unhandled Rejection at: Promise ', p, reason),
            );

            server.once('listening', () => {
                logger.info(
                    'Feathers application started on http://%s:%d',
                    app.get('host'),
                    port,
                );
                setTimeout(resolve, 1000);
            });
        });
    });

    const after = (done) => {
        server.close(() => {
            app.get('sequelizeClient').close().then(done);
        });
    };

    return { getPage, getApi, before, after };
};



module.exports = (port) => {
    let env = null;
    switch (process.env.TEST_ENV) {
        case 'dev':
            env = testDev(port);
            break;
        case 'ci':
            env = testCI(port);
            break;
        case 'staging':
            env = testStaging(port);
            break;
        default:
            env = testCI(port);
    }
    return env;
};