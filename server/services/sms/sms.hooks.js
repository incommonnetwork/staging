

module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [async (context) => {
            const sequelizeClient = context.app.get('sequelizeClient');
            const phones = sequelizeClient.models.phones;
            await phones.findOrCreate({
                where: {
                    number: context.data.From

                }
            });
        }],
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
