const url = require('url');

const testDev = () => {
    const before = () => { };// (done) => { setTimeout(done, 1000); };
    const after = () => { };//(done) => { setTimeout(done, 1000); };
    const getUrl = pathname => url.format({
        hostname: 'localhost',
        protocol: 'http',
        port: 3030,
        pathname
    });
    return { getUrl, before, after };
};

const testCI = (port) => {
    /* eslint-disable no-console */
    const logger = require('../server/logger');
    const app = require('../server/app');
    const nextApp = require('../server/nextApp').nextApp;

    const getUrl = pathname => url.format({
        hostname: app.get('host') || 'localhost',
        protocol: 'http',
        port,
        pathname
    });

    let server = null;

    const before = (done) => {
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
                setTimeout(done, 1000);
            });
        });
    };

    const after = (done) => {
        server.close(() => {
            app.get('sequelizeClient').close().then(done)
        });
    };

    return { getUrl, before, after };
};



module.exports = (port) => {
    let env = null;
    switch (process.env.TEST_ENV) {
        case 'dev':
            env = testDev(port);
            break;
        default:
            env = testCI(port);
    }
    return env;
};