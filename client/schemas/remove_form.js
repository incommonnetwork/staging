
import getApp from '../utils/feathers';

export default {
    redirect: '/home',
    title: 'Create User',
    schema: {
        type: 'object',
        required: [],
        properties: {
            confirm: {
                type: 'null',
                title: 'Confirm Removal'
            }
        }
    },
    uiSchema: {
        password: {
            'ui:widget': 'password'
        },
        confirm_password: {
            'ui:widget': 'password'
        }
    },
    form_init: async (context) => {
        context.title = `Remove ${context.service} ${context.id}`;
        context.schema.properties.confirm.description = `Are you sure you want to remove ${context.service} ${context.id}?\n THIS CANNOT BE UNDONE`;
        return {};
    },
    onSubmit: (send) => ({ formData }) => send({
        type: 'SUBMIT',
        formData
    }),
    submit_service: async (_, context) => {
        const app = await getApp();
        await app.service(context.service).remove(context.id);
    },
    submit_service_done: () => {
        throw new Error('submit_service_done() NOT IMPLEMENTED');
    }
};