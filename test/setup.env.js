/* global jasmine*/
const url = require('url');
const fetch = require('node-fetch');
const feathers = require('@feathersjs/feathers');
const auth = require('@feathersjs/authentication-client');
const rest = require('@feathersjs/rest-client');


const initApi = (url) => {
    const app = feathers();
    const restClient = rest(url);
    app.configure(restClient.fetch(fetch));
    app.configure(auth({}));

    return app;
};

const testDev = () => {
    const api_url = 'http://localhost:3030';

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

    const getPage = getApi;
    return { getPage, getApi, before, after, initApi: () => initApi(api_url) };
};

const testStaging = () => {
    const api_url = 'https://staging.incommon.dev';

    const before = () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    };
    const after = () => { };

    const getPage = pathname => url.format({
        hostname: 'www.incommon.dev',
        protocol: 'https',
        pathname: `/staging${pathname === '/' ? pathname : `${pathname}/`}`
    });

    const getApi = pathname => url.format({
        hostname: 'staging.incommon.dev',
        protocol: 'https',
        pathname,
    });

    return { getPage, getApi, before, after, initApi: () => initApi(api_url) };
};

const testCI = (port) => {
    const api_url = `http://localhost:${port}`;

    const logger = require('../server/logger');
    const app = require('../server/app');
    const nextApp = require('../server/nextApp').nextApp;

    const getApi = pathname => url.format({
        hostname: app.get('host') || 'localhost',
        protocol: 'http',
        port,
        pathname
    });

    const getPage = getApi;

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

    return { getPage, getApi, before, after, initApi: () => initApi(api_url) };
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