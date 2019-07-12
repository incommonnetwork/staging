const { authenticate } = require('@feathersjs/authentication').hooks;

const addCityGet = async (context) => {

    const sequelizeClient = context.app.get('sequelizeClient');
    const city = await sequelizeClient.models.cities.findByPk(context.result.id);
    context.result.city = city.get('city');
};

module.exports = {
    before: {
        all: [authenticate('jwt')],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [],
        find: [],
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
