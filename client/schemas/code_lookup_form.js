
import getApp from '../utils/feathers';

export default {
    redirect: '/home',
    schema: {
        type: 'object',
        required: ['text'],
        properties: {
            text: {
                title: 'Code',
                type: 'string'
            }
        }
    },
    uiSchema: {
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
    submit_service: async ({ formData }) => {
        const app = await getApp();
        const result = await app.service('codes').find({
            query: formData
        });
        if (!result.total) throw new Error('Code Not Found');
        return result.data[0];
    },
    submit_service_done: () => {
        throw new Error('NOT IMPLEMENTED');
    }
};