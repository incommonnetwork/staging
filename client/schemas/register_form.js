/* global window */
import getApp from '../utils/feathers';
import moment from 'moment';

const getCityNeighborhoodSchema = async () => {
    const app = await getApp();
    const cities = await app.service('cities').find({
        query: {
            $limit: 50
        }
    });

    const schema = {
        title: 'City',
        type: 'object',
        anyOf: [{
            title: 'Select City...'
        }]
    };

    for (const city of cities.data) {
        const neighborhoodSchema = await getNeighborhoodSchema(city.id);
        schema.anyOf.push({
            title: city.city,
            properties: {
                neighborhood: neighborhoodSchema
            },
            required: ['neighborhood']
        });
    }

    return schema;
};

const getNeighborhoodSchema = async (cityId) => {
    const app = await getApp();
    const city = await app.service('cities').get(cityId);
    const neighborhoods = await app.service('neighborhoods').find({
        query: {
            cityId,
            $limit: 50
        }
    });

    const schema = {
        title: `Neighborhood - ${city.city}`,
        type: 'number',
        enum: [],
        enumNames: []
    };

    for (const neighborhood of neighborhoods.data) {
        const key = `${neighborhood.area ? `${neighborhood.area} - ` : ''}${neighborhood.neighborhood}`;
        schema.enum.push(neighborhood.id);
        schema.enumNames.push(key);
    }

    return schema;
};

export default {
    redirect: '/home',
    title: 'Create Neighborhood',
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
        'dates': {
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
        const query = Object.fromEntries(new URLSearchParams(window.location.search));

        const neighborhoodId = formData.city ? formData.city.neighborhood : formData.neighborhood;
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

        const schema = context.schema;
        const app = await getApp();
        const query = Object.fromEntries(new URLSearchParams(window.location.search));
        const code = await app.service('codes').get(query.code);

        if (!code.cityId) {
            schema.required.push('city');
            const citySchema = await getCityNeighborhoodSchema();
            schema.properties.city = citySchema;
        } else {
            const neighborhood = await getNeighborhoodSchema(code.cityId);
            schema.properties.neighborhood = neighborhood;
            schema.required.push('neighborhood');
        }

        const dateMap = new Map();
        const dateEnum = [];
        code.dates = code.dates || [Date.now()];

        schema.title = code.text.toUpperCase();
        if (code.description) {
            schema.description = code.description;
        }

        schema.properties.dates = {
            title: 'Dates',
            description: 'select the dates you are most likely to be free for dinner',
            type: 'array',
            items: {
                type: 'string',
            },
            uniqueItems: true
        };

        for (const date of (code.dates || [Date.now()])) {
            const m = moment(date);
            const key = m.format('dddd, MMMM Do');
            dateMap.set(key, date);
            dateEnum.push(key);
        }

        schema.properties.dates.items.enum = code.dates.map(d => moment(d).format('dddd, MMMM Do')) || [];

        const maps = { dateMap };
        return { schema, maps };
    },
    submit_service_done: () => {
        throw new Error('submit_service_done() NOT IMPLEMENTED');
    }
};