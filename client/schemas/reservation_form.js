import getApp from '../utils/feathers';

const getSchema = async () => {
    const app = await getApp();
    const restaurants = await app.service('restaurants').find({
        query: {
            $limit: 50
        }
    });

    const codes = await app.service('codes').find({
        query: {
            $limit: 50
        }
    });

    const schema = {
        properties: {
            codeId: {
                title: 'Code',
                type: 'number',
                enum: codes.data.map(({ id }) => id),
                enumNames: codes.data.map(({ text }) => text)
            },
            restaurantId: {
                title: 'Restaurant',
                type: 'number',
                enum: restaurants.data.map(({ id }) => id),
                enumNames: restaurants.data.map(({ name, city }) => `${name} - ${city}`)
            },
            date: {
                title: 'Date',
                type: 'string'
            },
            time: {
                title: 'Time',
                type: 'string',
                enum: [
                    '6:00',
                    '6:30',
                    '7:00',
                    '7:30',
                    '8:00'
                ]
            },
            capacity: {
                title: 'Capacity',
                type: 'number',
                enum: [
                    4,
                    5,
                    6,
                    7,
                    8
                ]
            }
        },
    };


    return { schema, maps: {} };
};

export default {
    redirect: '/home',
    title: 'Create Reservation',
    maps: {},
    schema: {
        type: 'object',
        required: ['restaurantId', 'codeId', 'date'],
        properties: {
        }
    },
    uiSchema: {
        'date': {
            'ui:widget': 'date'
        },
        'code': {
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
    submit_service: async ({ formData }) => {
        const hour = Number.parseInt(formData.time.split(':')[0]) + 12;
        const minute = formData.time.split(':')[1];
        formData.date += ` ${hour}:${minute}:00 +00`;
        const app = await getApp();
        return app.service('reservations').create(formData);
    },
    form_init: async () => {

        const { schema, maps } = await getSchema();
        return { schema, maps };
    },
    submit_service_done: () => {
        throw new Error('submit_service_done() NOT IMPLEMENTED');
    }
};