const { authenticate } = require('@feathersjs/authentication').hooks;

const addUser = async (context) => {
    context.data.userId = context.params.user.id;
};

const populateFieldsFind = async (context) => {
    const sequelizeClient = context.app.get('sequelizeClient');

    for (const registrationData of context.result.data) {
        registrationData.user = (await sequelizeClient.models.users.findByPk(registrationData.userId)).email;
        registrationData.code = (await sequelizeClient.models.codes.findByPk(registrationData.codeId)).text;
        registrationData.neighborhood = (await sequelizeClient.models.neighborhoods.findByPk(registrationData.neighborhoodId)).neighborhood;
    }
};


module.exports = {
    before: {
        all: [authenticate('jwt')],
        find: [],
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
