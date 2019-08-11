
import getApp from '../utils/feathers';

export default {
    redirect: '/home',
    title: 'Create Phone',
    schema: {
        type: 'object',
        required: ['number', 'country', 'city', 'state', 'zip'],
        properties: {
            number: {
                title: 'Number',
                type: 'string'
            },
            country: {
                title: 'country',
                type: 'string'
            },
            city: {
                title: 'City',
                type: 'string'
            },
            state: {
                title: 'State',
                type: 'string'
            },
            zip: {
                title: 'Zip Code',
                type: 'string'
            }
        }
    },
    uiSchema: {
    },
    validate: (formData, errors) => {
        return errors;
    },
    onSubmit: (send) => ({ formData }) => send({
        type: 'SUBMIT',
        formData
    }),
    submit_service: async ({ formData }) => {
        const app = await getApp();
        const created = await app.service('phones').create(formData);
        return created;
    },
    submit_service_done: () => {
        throw new Error('submit_service_done() NOT IMPLEMENTED');
    }
};