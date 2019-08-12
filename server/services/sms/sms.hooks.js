const getUser = async (context) => {
    const sequelizeClient = context.app.get('sequelizeClient');
    const phones = sequelizeClient.models.phones;
    const [result] = await phones.findOrCreate({
        where: {
            number: context.data.From,
            zip: context.data.FromZip,
            city: context.data.FromCity,
            state: context.data.FromState,
            country: context.data.FromCountry
        }
    });

    const users = sequelizeClient.models.users;

    const user = await users.findOne({
        where: {
            phoneId: result.get('id')
        }
    });

    context.params.user = user || false;
    context.params.phone = result;
};

const getCode = async (context) => {
    const sequelizeClient = context.app.get('sequelizeClient');

    const code = await sequelizeClient.models.codes.findOne({
        where: {
            text: context.data.Body.toLowerCase()
        }
    });

    context.params.code = code || false;
};

module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [getUser, getCode],
        update: [],
        patch: [],
        remove: []
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
