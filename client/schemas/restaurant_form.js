import getApp from '../utils/feathers';

export default {
    redirect: '/home',
    title: 'Create User',
    schema: {
    },
    uiSchema: {
        password: {
            'ui:widget': 'password'
        },
        confirm_password: {
            'ui:widget': 'password'
        }
    },
    validate: (formData, errors) => {
        return errors;
    },
    form_init: async () => {
        const app = await getApp();
        const neighborhoods = await app.service('neighborhoods').find({
            query: {
                $limit: 50
            }
        });

        const cityNeighborhoods = new Map();

        for (const neighborhood of neighborhoods.data) {
            const neighborhoodSet = cityNeighborhoods.get(neighborhood.cityId) || new Set();
            cityNeighborhoods.set(neighborhood.cityId, neighborhoodSet);
            neighborhoodSet.add(neighborhood);
        }

        const schema = {
            title: 'location',
            type: 'object',

            anyOf: [{
                title: 'Select City...',
            }]

        };

        for (const [id, neighborhoodSet] of cityNeighborhoods) {
            const city = await app.service('cities').get(id);

            const neighborhoodSchema = {
                title: city.city,
                type: 'object',

                properties: {
                    neighborhoodId: {
                        title: 'Neighborhood',
                        type: 'number',
                        enum: [],
                        enumNames: []
                    },
                    name: {
                        title: 'Name',
                        type: 'string'
                    },
                    address: {
                        title: 'Address',
                        type: 'string'
                    },
                    url: {
                        title: 'URL',
                        type: 'string'
                    }
                }
            };

            for (const neighborhood of Array.from(neighborhoodSet)) {
                neighborhoodSchema.properties.neighborhoodId.enum.push(neighborhood.id);
                neighborhoodSchema.properties.neighborhoodId.enumNames.push(neighborhood.neighborhood);
            }

            schema.anyOf.push(neighborhoodSchema);
        }

        return { schema };
    },
    onSubmit: (send) => ({ formData }) => send({
        type: 'SUBMIT',
        formData
    }),
    submit_service: async ({ formData }) => {
        const app = await getApp();
        const created = await app.service('restaurants').create(formData);
        return created;
    },
    submit_service_done: () => {
        throw new Error('submit_service_done() NOT IMPLEMENTED');
    }
};