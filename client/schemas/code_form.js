
import getApp from '../utils/feathers';

export default {
    redirect: '/home',
    title: 'Create Code',
    schema: {
        type: 'object',
        required: ['text', 'dates'],
        properties: {
            text: {
                title: 'text',
                type: 'string'
            },
            description: {
                title: 'Description',
                type: 'string'
            },
            dates: {
                title: 'Dates',
                type: 'array',
                items: {
                    type: 'string',
                    format: 'date'
                }
            }
        }
    },
    uiSchema: {
        dates: {
            "ui:options": {
                orderable: false
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
    submit_service: async ({ formData }) => {
        const app = await getApp();
        const created = await app.service('codes').create(formData);
        return created;
    },
    submit_service_done: () => {
        throw new Error('submit_service_done() NOT IMPLEMENTED');
    }
};