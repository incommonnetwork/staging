const { authenticate } = require('@feathersjs/authentication').hooks;
const { NotAuthenticated } = require('@feathersjs/errors');
const addRefs = require('../../hooks/refs.js');

const isAdmin = async (context) => {
    const { app, params: { user } } = context;
    const sequelizeClient = app.get('sequelizeClient');

    const [adminRole] = await sequelizeClient.model('roles').findAll({
        where: {
            type: 'admin'
        }
    });

    if (!adminRole) return false;

    const [user_roles] = await sequelizeClient.model('user_roles').findAll({
        where: {
            userId: user.id,
            roleId: adminRole.dataValues.id
        }
    });

    if (!user_roles) {
        throw new NotAuthenticated();
    }
};

const handleNullQueries = hook => {
    let where = Object.assign({}, hook.params.query);

    function transformQuery(obj) {
        Object.keys(obj).forEach(function (prop) {
            let value = obj[prop];
            if (value !== null && typeof value === 'object')
                obj[prop] = transformQuery(value);
            else if (value === 'NULL') //Yes currently i use uppercase null for this, maybe change it to lowercase
                obj[prop] = null;
        });
        return obj;
    }

    hook.params.query = transformQuery(where);
};

module.exports = {
    before: {
        all: [authenticate('jwt')],
        find: [handleNullQueries, isAdmin],
        get: [],
        create: [isAdmin],
        update: [isAdmin],
        patch: [isAdmin],
        remove: [isAdmin]
    },

    after: {
        all: [],
        find: [],
        get: [addRefs()],
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
