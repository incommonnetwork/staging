import getApp from '../utils/feathers';
const getSchema = async () => {
    const app = await getApp();
    const registrationsWithoutInvite = await app.service('registrations').find({
        query: {
            inviteId: 'NULL',
            $limit: 50
        }
    });

    const registrationMap = new Map();

    const codeCities = new Map();

    for (const registration of registrationsWithoutInvite.data) {
        const registrationCityId = (await app.service('neighborhoods').get(registration.neighborhoodId)).cityId;

        const cityDates = codeCities.get(registrationCityId) || new Map();
        codeCities.set(registrationCityId, cityDates);

        const dateRegistration = cityDates.get(registration.neighborhoodId) || new Map();
        cityDates.set(registration.neighborhoodId, dateRegistration);

        const registrationSet = dateRegistration.get(registration.dates[0]) || new Set();
        dateRegistration.set(registration.dates[0], registrationSet);

        registrationSet.add(registration);
        registrationMap.set(registration.id, registration.dates[0]);
    }

    const schema = {
        title: 'Code',
        type: 'object',
        anyOf: [{
            title: 'Select Code...'
        }]
    };

    const codes = new Map();
    const cities = new Map();
    const users = new Map();
    const restaurantsMap = new Map();

    for (const [id, cityDates] of codeCities) {
        const code = codes.has(id) ? codes.get(id) : await app.service('codes').get(id);
        codes.set(id, code);

        const codeSchema = {
            title: code.text,
            anyOf: [{
                title: 'Select City...'
            }]
        };

        for (const [id, dateRegistration] of cityDates) {
            const city = cities.has(id) ? cities.get(id) : await app.service('cities').get(id);
            cities.set(id, city);

            const citySchema = {
                title: city.city,
                anyOf: [{
                    title: 'Select Date...'
                }]
            };

            const restaurants = restaurantsMap.has(city.id) ? restaurantsMap.get(city.id) : await app.service('restaurants').find({
                query: {
                    cityId: city.id
                }
            });

            restaurantsMap.set(city.id, restaurants);


            for (const [date, registrationSet] of dateRegistration) {
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
                        restaurantId: {
                            title: 'Restaurant',
                            type: 'number',
                            enum: [],
                            enumNames: []
                        }
                    }
                };

                for (const restaurant of restaurants.data) {
                    const id = restaurant.id;
                    dateSchema.properties.restaurantId.enum.push(id);
                    dateSchema.properties.restaurantId.enumNames.push(`${restaurant.name} - ${restaurant.area} - ${restaurant.neighborhood}`);
                }

                for (const registration of Array.from(registrationSet)) {
                    const id = registration.id;
                    const user = users.has(registration.userId) ? users.get(registration.userId) : await app.service('users').get(registration.userId);
                    users.set(registration.userId, user);
                    dateSchema.properties.registrations.items.enum.push(id);
                    dateSchema.properties.registrations.items.enumNames.push(`${user.email} - ${registration.neighborhood}`);
                }

                citySchema.anyOf.push(dateSchema);
            }

            codeSchema.anyOf.push(citySchema);

            // for (const [id, dateRegistration] of neighborhoodDates) {
            //     const neighborhood = neighborhoods.has(id) ? neighborhoods.get(id) : await app.service('neighborhoods').get(id);
            //     neighborhoods.set(id, neighborhood);

            //     const restaurants = restaurantsMap.has(neighborhood.id) ? restaurantsMap.get(neighborhood.id) : await app.service('restaurants').find({
            //         query: {
            //             neighborhoodId: neighborhood.id
            //         }
            //     });

            //     restaurantsMap.set(neighborhood.id, restaurants);

            //     if (!restaurants.total) continue;

            //     const neighborhoodSchema = {
            //         title: neighborhood.neighborhood,
            //         anyOf: [{
            //             title: 'Select Date'
            //         }]
            //     };

            //     for (const [date, registrationSet] of dateRegistration) {


            //         const dateSchema = {
            //             title: date,
            //             type: 'object',
            //             required: ['registrations', 'restaurant'],
            //             properties: {
            //                 registrations: {
            //                     type: 'array',
            //                     uniqueItems: true,
            //                     items: {
            //                         type: 'number',
            //                         enum: [],
            //                         enumNames: []
            //                     }
            //                 },
            //                 restaurantId: {
            //                     title: 'Restaurant',
            //                     type: 'number',
            //                     enum: [],
            //                     enumNames: []
            //                 }
            //             }
            //         };

            //         for (const restaurant of restaurants.data) {
            //             const id = restaurant.id;
            //             dateSchema.properties.restaurantId.enum.push(id);
            //             dateSchema.properties.restaurantId.enumNames.push(restaurant.name);
            //         }

            //         for (const registration of Array.from(registrationSet)) {
            //             const id = registration.id;
            //             const user = users.has(registration.userId) ? users.get(registration.userId) : await app.service('users').get(registration.userId);
            //             users.set(registration.userId, user);
            //             dateSchema.properties.registrations.items.enum.push(id);
            //             dateSchema.properties.registrations.items.enumNames.push(user.email);
            //         }

            //         neighborhoodSchema.anyOf.push(dateSchema);
            //     }

            //     citySchema.anyOf.push(neighborhoodSchema);
            // }

        }

        schema.anyOf.push(codeSchema);
    }

    return { schema, maps: { registrationMap } };
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
    submit_service: async ({ formData }, context) => {
        const { restaurantId, registrations } = formData;
        const date = context.maps.registrationMap.get(registrations[0]);
        const app = await getApp();
        const invite = await app.service('invites').create({ date, restaurantId, registrations });

        return invite;
    },
    form_init: async () => {

        const { schema, maps } = await getSchema();
        return { schema, maps };
    },
    submit_service_done: () => {
        throw new Error('submit_service_done() NOT IMPLEMENTED');
    }
};