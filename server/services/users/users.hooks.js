const { authenticate } = require('@feathersjs/authentication').hooks;
const { Forbidden, NotImplemented } = require('@feathersjs/errors');

const {
    hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

const authorize = (context) => {
    const { user, query } = context.params;

    /* eslint-disable no-fallthrough */
    switch (context.method) {
        case 'find':
            if (user) throw new Forbidden('Not Authorized');
        case 'get':
        case 'update':
        case 'patch':
        case 'remove':
            if (user && (user.id !== query.id)) throw new Forbidden('Not Authorized');
            break;
        default:
            throw new NotImplemented(__dirname);

    }
    /* eslint-enable no-fallthrough */

    return context;
};


module.exports = {
    before: {
        all: [],
        find: [authenticate('jwt'), authorize],
        get: [authenticate('jwt'), authorize],
        create: [hashPassword()],
        update: [hashPassword(), authenticate('jwt'), authorize],
        patch: [hashPassword(), authenticate('jwt'), authorize],
        remove: [authenticate('jwt'), authorize]
    },

    after: {
        all: [
            // Make sure the password field is never sent to the client
            // Always must be the last hook
            protect('password')
        ],
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
