
import getApp from '../utils/feathers';
import moment from 'moment';

const getCityNeighborhoodSchema = async (codeId) => {
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
        const neighborhoodSchema = await getNeighborhoodSchema(city.id, codeId);
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

const getNeighborhoodSchema = async (cityId, codeId) => {
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
        type: 'string',
        enum: [],
        enumNames: []
    };

    for (const neighborhood of neighborhoods.data) {
        const key = `${neighborhood.area ? `${neighborhood.area} - ` : ''}${neighborhood.neighborhood}`;
        schema.enum.push(`${codeId}:${neighborhood.id}`);
        schema.enumNames.push(key);
    }

    return schema;
};

const getCodeSchema = async () => {
    const app = await getApp();
    const codes = await app.service('codes').find({
        query: {
            $limit: 50
        }
    });

    const users = await app.service('users').find({
        query: {
            $limit: 50
        }
    });

    const codeSchema = {
        type: 'object',
        properties: {
            code: {
                title: 'Code',
                type: 'object',
                required: [],
                anyOf: [{
                    title: 'Select Code...'
                }]
            },
            userId: {
                title: 'User',
                type: 'integer',
                enum: [],
                enumNames: []
            }
        }
    };

    for (const user of users.data) {
        codeSchema.properties.userId.enum.push(user.id);
        codeSchema.properties.userId.enumNames.push(user.email);
    }

    const dateMap = new Map();

    for (const code of codes.data) {
        const schema = {
            title: code.code,
            type: 'object',
            required: [],
            properties: {}
        };
        codeSchema.properties.code.anyOf.push(schema);

        if (!code.cityId) {
            schema.required.push('city');
            const citySchema = await getCityNeighborhoodSchema(code.id);
            schema.properties.city = citySchema;
        } else {
            const neighborhood = await getNeighborhoodSchema(code.cityId, code.id);
            schema.properties.neighborhood = neighborhood;
            schema.required.push('neighborhood');
        }

        const dateEnum = [];
        code.dates = code.dates || [Date.now()];

        schema.title = code.text.toUpperCase();
        if (code.description) {
            schema.description = code.description;
        }

        schema.properties.dates = {
            title: 'Dates',
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
    }

    return { schema: codeSchema, maps: { dateMap } };
};

export default {
    redirect: '/home',
    title: 'Create Registration',
    maps: {},
    schema: {
        type: 'object',
        required: ['dates'],
        properties: {
        }
    },
    uiSchema: {
        'code': {
            'dates': {
                'ui:widget': 'checkboxes'
            }
        }
    },
    validate: (formData, errors) => {
        return errors;
    },
    onSubmit: (send) => ({ formData }) => send({
        type: 'SUBMIT',
        formData
    }),
    submit_service: async ({ formData }, context) => {
        const neighborhoodParts = formData.code.city ? formData.code.city.neighborhood.split(':') : formData.code.neighborhood.split(':');
        const [codeId, neighborhoodId] = neighborhoodParts.map((s) => Number.parseInt(s));
        const { userId } = formData;

        const dates = formData.code.dates.map(k => context.maps.dateMap.get(k));
        const createData = { codeId, neighborhoodId, userId, dates };

        const app = await getApp();
        const created = await app.service('registrations').create(createData);
        return created;
    },
    form_init: async () => {
        return getCodeSchema();
    },
    submit_service_done: () => {
        throw new Error('submit_service_done() NOT IMPLEMENTED');
    }
};