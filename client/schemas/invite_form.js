import getApp from '../utils/feathers';
const getSchema = async () => {
    const app = await getApp();
    const registrationsWithoutInvite = await app.service('registrations').find({
        query: {
            inviteId: 'NULL',
            $limit: 50
        }
    });

    const codeCities = new Map();

    for (const registration of registrationsWithoutInvite.data) {
        const cityNeighborhoods = codeCities.get(registration.codeId) || new Map();
        codeCities.set(registration.codeId, cityNeighborhoods);

        const registrationCityId = (await app.service('neighborhoods').get(registration.neighborhoodId)).cityId;

        const neighborhoodDates = cityNeighborhoods.get(registrationCityId) || new Map();
        cityNeighborhoods.set(registrationCityId, neighborhoodDates);

        const dateRegistration = neighborhoodDates.get(registration.neighborhoodId) || new Map();
        neighborhoodDates.set(registration.neighborhoodId, dateRegistration);

        const registrationSet = dateRegistration.get(registration.dates[0]) || new Set();
        dateRegistration.set(registration.dates[0], registrationSet);

        registrationSet.add(registration);
    }

    const schema = {
        title: 'Code',
        type: 'object',
        oneOf: [{
            title: 'Select Code...'
        }]
    };

    for (const [id, cityNeighborhoods] of codeCities) {
        const code = await app.service('codes').get(id);

        const codeSchema = {
            title: code.text,
            oneOf: [{
                title: 'Select City...'
            }]
        };

        for (const [id, neighborhoodDates] of cityNeighborhoods) {
            const city = await app.service('cities').get(id);

            const citySchema = {
                title: city.city,
                oneOf: [{
                    title: 'Select Neighborhood...'
                }]
            };

            for (const [id, dateRegistration] of neighborhoodDates) {
                const neighborhood = await app.service('neighborhoods').get(id);

                const neighborhoodSchema = {
                    title: neighborhood.neighborhood,
                    oneOf: [{
                        title: 'Select Date'
                    }]
                };

                for (const [date, registrationSet] of dateRegistration) {
                    const restaurants = await app.service('restaurants').find({
                        query: {
                            neighborhoodId: neighborhood.id
                        }
                    });

                    const dateSchema = {
                        title: date,
                        type: 'object',
                        required: ['registrations', 'restaurant'],
                        properties: {
                            registrations: {
                                type: 'array',
                                uniqueItems: true,
                                items: {
                                    type: 'number',
                                    enum: [],
                                    enumNames: []
                                }
                            },
                            restaurant: {
                                type: 'number',
                                enum: [],
                                enumNames: []
                            }
                        }
                    };

                    for (const restaurant of restaurants.data) {
                        const id = restaurant.id;
                        dateSchema.properties.restaurant.enum.push(id);
                        dateSchema.properties.restaurant.enumNames.push(restaurant.name);
                    }

                    for (const registration of Array.from(registrationSet)) {
                        const id = registration.id;
                        const user = await app.service('users').get(registration.userId);
                        dateSchema.properties.registrations.items.enum.push(id);
                        dateSchema.properties.registrations.items.enumNames.push(user.email);
                    }

                    neighborhoodSchema.oneOf.push(dateSchema);
                }

                citySchema.oneOf.push(neighborhoodSchema);
            }

            codeSchema.oneOf.push(citySchema);
        }

        schema.oneOf.push(codeSchema);
    }

    return { schema };
};

export default {
    redirect: '/home',
    title: 'Create Invite',
    maps: {},
    schema: {
        type: 'object',
        required: ['dates'],
        properties: {
        }
    },
    uiSchema: {
        'city': {
        },
        'registrations': {
            'ui:widget': 'checkboxes'
        },
    },
    validate: (formData, errors) => {
        return errors;
    },
    onSubmit: (send) => ({ formData }) => send({
        type: 'SUBMIT',
        formData
    }),
    submit_service: async () => {
    },
    form_init: async () => {

        const { schema } = await getSchema();

        return { schema, maps: {} };
    },
    submit_service_done: () => {
        throw new Error('submit_service_done() NOT IMPLEMENTED');
    }
};