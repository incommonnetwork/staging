const { authenticate } = require('@feathersjs/authentication').hooks;

const addCityNeighborhoodGet = async (context) => {

    const sequelizeClient = context.app.get('sequelizeClient');
    const city = await sequelizeClient.model('cities').findByPk(context.result.cityId);
    const neighborhood = await sequelizeClient.model('neighborhoods').findByPk(context.result.neighborhoodId);
    context.result.city = city.get('city');
    context.result.neighborhood = neighborhood.get('neighborhood');
};

const addCityCreate = async (context) => {
    const sequelizeClient = context.app.get('sequelizeClient');
    const city = await sequelizeClient.model('neighborhoods').findByPk(context.data.neighborhoodId);
    context.data.cityId = city.get('id');
};

const addCityNeighborhoodFind = async (context) => {
    const sequelizeClient = context.app.get('sequelizeClient');

    for (const restaurant of context.result.data) {
        const city = await sequelizeClient.model('cities').findByPk(restaurant.cityId);
        const neighborhood = await sequelizeClient.model('neighborhoods').findByPk(restaurant.neighborhoodId);
        restaurant.city = city.get('city');
        restaurant.neighborhood = neighborhood.get('neighborhood');
    }
};

module.exports = {
    before: {
        all: [authenticate('jwt')],
        find: [],
        get: [],
        create: [addCityCreate],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [],
        find: [addCityNeighborhoodFind],
        get: [addCityNeighborhoodGet],
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
