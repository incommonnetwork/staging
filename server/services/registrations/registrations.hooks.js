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
    const _admin = await isAdmin(context)
    context.data.userId = _admin ? context.data.userId : context.params.user.id;
};

const populateFieldsFind = async (context) => {
    const sequelizeClient = context.app.get('sequelizeClient');

    for (const registrationData of context.result.data) {
        registrationData.user = (await sequelizeClient.models.users.findByPk(registrationData.userId)).email;
        registrationData.code = (await sequelizeClient.models.codes.findByPk(registrationData.codeId)).text;
        registrationData.neighborhood = (await sequelizeClient.models.neighborhoods.findByPk(registrationData.neighborhoodId)).neighborhood;
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
        find: [handleNullQueries],
        get: [],
        create: [addUser],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [],
        find: [populateFieldsFind],
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
