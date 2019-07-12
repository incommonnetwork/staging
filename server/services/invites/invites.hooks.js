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

const addCodeAndRestaurant = async (context) => {
    const sequelizeClient = context.app.get('sequelizeClient');

    const invite = await sequelizeClient.models.invites.findByPk(context.result.id);
    const registrations = await invite.getRegistrations();
    const firstRegistration = registrations[0];
    const code = await firstRegistration.getCode();
    const restaurant = await invite.getRestaurant();

    context.result.code = code.get('text');
    context.result.restaurant = restaurant.get('name');
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
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [],
        find: [addRestaurant, addCodeAndUsers],
        get: [addCodeAndRestaurant],
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
