

module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [async (context) => {
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

            const {data: [user]} = await context.app.service('users').find({
                query: {
                    phoneId: result.get('id')
                }
            });

            context.params.user = user || false;
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
