const { Forbidden } = require('@feathersjs/errors');

const RejectClient = () => {
    throw new Forbidden('client cannot call internal method');
};

module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [RejectClient],
        update: [RejectClient],
        patch: [RejectClient],
        remove: [RejectClient]
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
