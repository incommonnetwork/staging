const { authenticate } = require('@feathersjs/authentication').hooks;

const addRestaurant = async (context) => {
    const sequelizeClient = context.app.get('sequelizeClient');

    for (const inviteData of context.result.data) {
        const restaurant = await sequelizeClient.models.restaurants.findByPk(inviteData.restaurantId);
        inviteData.restaurant = restaurant.get('name');
    }
};


const addCodeAndUsers = async (context) => {
    const sequelizeClient = context.app.get('sequelizeClient');

    for (const inviteData of context.result.data) {
        const invite = await sequelizeClient.models.invites.findByPk(inviteData.id);
        const registrations = await invite.getRegistrations();
        const firstRegistration = registrations[0];
        const code = await firstRegistration.getCode();
        inviteData.code = code.get('text');
        inviteData.users = registrations.length;
    }
};

const addCode = async (context) => {
    const sequelizeClient = context.app.get('sequelizeClient');

    const invite = await sequelizeClient.models.invites.findByPk(context.result.id);
    const registrations = await invite.getRegistrations();
    const firstRegistration = registrations[0];
    const code = await firstRegistration.getCode();

    context.result.code = code.get('text');
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
        find: [addRestaurant, addCodeAndUsers],
        get: [addCode],
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
