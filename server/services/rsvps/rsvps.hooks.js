
const { authenticate } = require('@feathersjs/authentication').hooks;

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

const addUser = async (context) => {
    context.data.userId = context.params.user.id;
};


module.exports = {
    before: {
        all: [authenticate('jwt')],
        find: [isAdmin],
        get: [isAdmin],
        create: [addUser],
        update: [isAdmin],
        patch: [isAdmin],
        remove: [isAdmin]
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
