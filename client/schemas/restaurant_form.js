import getApp from '../utils/feathers';

export default {
    redirect: '/home',
    title: 'Create Restaurant',
    schema: {
        title: 'Restaurant',
        type: 'object',
        properties: {
            name: {
                title: 'Name',
                type: 'string'
            },
            address: {
                title: 'Address',
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
            country: {
                title: 'Country',
                type: 'string'

            },
            url: {
                title: 'URL',
                type: 'string'
            },
            map: {
                title: 'Map',
                type: 'string'
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
    validate: (formData, errors) => {
        return errors;
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