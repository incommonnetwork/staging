/* global window */
import getApp from '../utils/feathers';
import moment from 'moment';

export default {
    redirect: '/home',
    title: 'Create Neighborhood',
    schema: {
        type: 'object',
        required: ['city', 'neighborhood', 'dates'],
        properties: {
            city: {
                title: 'City',
                type: 'string'
            },
            neighborhood: {
                title: 'Neighborhood',
                type: 'string'
            },
            dates: {
                type: 'array',
                items: {
                    type: 'string',
                },
                uniqueItems: true
            }
        }
    },
    uiSchema: {
        'dates': {
            'ui:widget': 'checkboxes'
        },
    },
    validate: (formData, errors) => {
        return errors;
    },
    onChange: (send) => ({ formData }) => send({
        type: 'CHANGE',
        formData
    }),
    onSubmit: (send) => ({ formData }) => send({
        type: 'SUBMIT',
        formData
    }),
    submit_service: async ({ formData }, context) => {
        const query = Object.fromEntries(new URLSearchParams(window.location.search));

        const neighborhoodId = context.maps.neighborhoodMap.get(formData.neighborhood).id;
        const dates = formData.dates.map(k => context.maps.dateMap.get(k));

        const registration = {
            codeId: Number.parseInt(query.code),
            neighborhoodId,
            dates
        };

        const app = await getApp();
        const created = await app.service('registrations').create(registration);
        return created;
    },
    form_init: async (context) => {
        const app = await getApp();
        const query = Object.fromEntries(new URLSearchParams(window.location.search));
        const code = await app.service('codes').get(query.code);

        const cities = await app.service('cities').find();
        const cityMap = new Map();
        const cityEnum = [];
        const neighborhoodMap = new Map();
        const neighborhoodEnum = [];

        for (const city of cities.data) {
            const key = `${city.state} - ${city.city}`;
            cityMap.set(key, city);
            cityEnum.push(key);
        }

        const uiSchema = context.uiSchema;
        const schema = context.schema;
        schema.changed = true;
        schema.properties.city.enum = cityEnum;
        schema.properties.neighborhood.enum = neighborhoodEnum;

        if (code.cityId) {
            for (const [key, city] of cityMap) {
                if (city.id === code.cityId) {
                    delete schema.properties.city.enum;
                    schema.properties.city.default = key;
                    uiSchema.city = {
                        'ui:readonly': true
                    };

                    const neighborhoods = await app.service('neighborhoods').find({
                        query: {
                            cityId: city.id
                        }
                    });

                    for (const neighborhood of neighborhoods.data) {
                        const key = `${neighborhood.area ? `${neighborhood.area} - ` : ''}${neighborhood.neighborhood}`;
                        neighborhoodMap.set(key, neighborhood);
                        neighborhoodEnum.push(key);
                    }
                    break;
                }
            }
        }

        const dateMap = new Map();
        const dateEnum = [];
        code.dates = code.dates || [Date.now()];


        for (const date of (code.dates || [Date.now()])) {
            const m = moment(date);
            const key = m.format('dddd, MMMM Do');
            dateMap.set(key, date);
            dateEnum.push(key);
        }

        schema.properties.dates.items.enum = code.dates.map(d => moment(d).format('dddd, MMMM Do')) || [];

        const maps = { cityMap, neighborhoodMap, dateMap };
        return { schema, maps, uiSchema };
    },
    submit_service_done: () => {
        throw new Error('submit_service_done() NOT IMPLEMENTED');
    }
};