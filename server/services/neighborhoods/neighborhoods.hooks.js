const { authenticate } = require('@feathersjs/authentication').hooks;
const { NotAuthenticated } = require('@feathersjs/errors');

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
    if (!(await isAdmin(context))) throw new NotAuthenticated();
};

const addCity = async (context) => {
    const sequelizeClient = context.app.get('sequelizeClient');

    for (const neighborhoodData of context.result.data) {
        const neighborhood = await sequelizeClient.models.neighborhoods.findByPk(neighborhoodData.id);
        const city = await sequelizeClient.model('cities').findByPk(neighborhood.get('cityId'));
        neighborhoodData.city = city ? city.get('city') : null;
    }
};

const addCityGet = async (context) => {

    const sequelizeClient = context.app.get('sequelizeClient');
    const city = await sequelizeClient.model('cities').findByPk(context.result.id);
    context.result.city = city ? city.get('city') : null;
};

module.exports = {
    before: {
        all: [authenticate('jwt')],
        find: [],
        get: [],
        create: [authorize],
        update: [authorize],
        patch: [authorize],
        remove: [authorize]
    },

    after: {
        all: [],
        find: [addCity],
        get: [addCityGet],
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

