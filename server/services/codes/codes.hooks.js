const { authenticate } = require('@feathersjs/authentication').hooks;
const { Forbidden } = require('@feathersjs/errors');
const addRefs = require('../../hooks/refs');

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

    return !!user_roles;
};

const authorize = async (context) => {
    if (!(await isAdmin(context))) throw new Forbidden();
};

const assignedBy = async (context) => {
    context.data.assignedById = context.params.user.id;
};


module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [authenticate('jwt'), authorize, assignedBy],
        update: [authenticate('jwt'), authorize, assignedBy],
        patch: [authenticate('jwt'), authorize, assignedBy],
        remove: [authenticate('jwt'), authorize]
    },

    after: {
        all: [],
        find: [addRefs()],
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
