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
    submit_service: async ({ formData }) => {
        const total = formData.total;
        const app = await getApp();
        const query = Object.fromEntries(new URLSearchParams(window.location.search));
        const inviteId = Number.parseInt(query.invite);
        const accepted = true;
        const created = await app.service('rsvps').create({ inviteId, accepted, total });
        return created;
    },
    form_init: async () => {

        const app = await getApp();
        const query = Object.fromEntries(new URLSearchParams(window.location.search));
        const invite = await app.service('invites').get(query.invite);

        const schema = {
            type: 'object',
            required: ['total'],
            properties: {
                code: {
                    title: 'Invite',
                    description: invite.code,
                    type: 'null'
                },
                restaurant: {
                    title: 'Restaurant',
                    description: invite.restaurant,
                    type: 'null'
                },
                total: {
                    title: 'Plus',
                    type: 'number',
                    default: 1,
                    enum: [
                        1,
                        2,
                        3
                    ],
                    enumNames: [
                        '0',
                        '1',
                        '2'
                    ]
                }
            }
        };
        return { schema };
    },
    submit_service_done: () => {
        throw new Error('submit_service_done() NOT IMPLEMENTED');
    }
};