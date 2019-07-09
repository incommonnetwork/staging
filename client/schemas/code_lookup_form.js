
import getApp from '../utils/feathers';
import Router from '../utils/router'

export default {
    redirect: '/home',
    title: 'Create Neighborhood',
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
    submit_service: async ({ formData }, context) => {
        const app = await getApp();
        const result = await app.service('codes').find({
            query: formData
        });
        if (!result.total) throw new Error('Code Not Found')
        console.log(result)
        return result.data[0];
    },
    submit_service_done: (context, code) => {
        console.log('submit_service_done')
        Router.push(`/register?code=${code.id}`)
    }
};