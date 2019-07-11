/* global window */
import getApp from '../utils/feathers';

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
    submit_service: async () => {
        // console.log('submit', formData);
    },
    form_init: async () => {

        const app = await getApp();
        const query = Object.fromEntries(new URLSearchParams(window.location.search));
        const invite = await app.service('invites').get(query.invite);

        const schema = {
            type: 'object',
            properties: {
                code: {
                    title: 'Invite',
                    desctiption: invite.code,
                    type: 'null'
                }
            }
        };
        return { schema };
    },
    submit_service_done: () => {
        throw new Error('submit_service_done() NOT IMPLEMENTED');
    }
};