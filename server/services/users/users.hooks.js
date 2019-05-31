const { authenticate } = require('@feathersjs/authentication').hooks;
const { Forbidden, NotImplemented } = require('@feathersjs/errors');

const {
    hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

const isAdmin = async (context) => {
    const { app, params: { user } } = context;
    const sequelizeClient = app.get('sequelizeClient');

    const [adminRole] = await sequelizeClient.model('roles').findAll({
        where: {
            type: 'admin'
        }
    });

    const [UserRole] = await sequelizeClient.model('UserRole').findAll({
        where: {
            userId: user.id,
            roleId: adminRole.dataValues.id
        }
    });

    return !!UserRole;
};

const authorize = async (context) => {
    const { user, query } = context.params;

    /* eslint-disable no-fallthrough */
    switch (context.method) {
        case 'find':
            // only allow a user to find themselves
            if (user && !(await isAdmin(context))) {
                context.params.query = user;
            }
            break;
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
