import feathers from '@feathersjs/feathers';
import auth from '@feathersjs/authentication-client';
import rest from '@feathersjs/rest-client';

let app = null;

const getClientApi = () => {
    switch (process.env.CONFIG_NODE_ENV) {
        case 'staging':
            return 'https://api.incommon.dev';
        case 'test':
            return 'https://staging.incommon.dev';
    }
};

async function init(req) {
    const app = feathers();
    const _fetch = req ? require('node-fetch') : fetch; // eslint-disable-line no-undef
    const api = req ? `http://localhost${process.env.NODE_ENV === 'production' ? '' : ':3030'}` : getClientApi();
    const restClient = rest(api);
    app.configure(restClient.fetch(_fetch));
    const authConfig = { storage: req ? undefined : localStorage }; // eslint-disable-line no-undef
    app.configure(auth(authConfig));


    return app;
}

export default async (req) => {
    if (!app) {
        app = await init(req);
    }

    return app;
};