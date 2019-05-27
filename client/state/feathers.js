import feathers from '@feathersjs/feathers';
import auth from '@feathersjs/authentication-client'
import rest from '@feathersjs/rest-client';

let app = null;

async function init(req) {
    const app = feathers()
    const fetch = req ? require('node-fetch') : window.fetch
    const api = req ? `http://localhost${process.env.NODE_ENV === 'production' ? '' : ':3030'}` : undefined
    const restClient = rest(api)
    app.configure(restClient.fetch(fetch));
    app.configure(auth({
        storage: req ? undefined : localStorage
    }))

    return app
}

export default async (req) => {
    if (!app) {
        app = await init(req)
    }
    return app
}