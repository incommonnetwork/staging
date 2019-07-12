import getApp from '../utils/feathers';
const getSchema = async () => {
    const app = await getApp();
    const invitesWithoutReservation = await app.service('invites').find({
        query: {
            reservationId: 'NULL',
            $limit: 50
        }
    });

    const schema = {
        properties: {
            inviteId: {
                title: 'Invite',
                type: 'number',
                enum: [],
                enumNames: []
            }
        },
    };

    for (const invite of invitesWithoutReservation.data) {
        const rsvps = await app.service('rsvps').find({
            query: {
                inviteId: invite.id
            }
        });

        const registrations = await app.service('registrations').find({
            query: {
                inviteId: invite.id
            }
        });

        const restaurant = await app.service('restaurants').get(invite.restaurantId);

        const name = `${invite.id} - ${rsvps.total}/${registrations.total} - ${restaurant.city} - ${restaurant.name}`;

        schema.properties.inviteId.enum.push(invite.id);
        schema.properties.inviteId.enumNames.push(name);
    }

    return { schema, maps: {} };
};

export default {
    redirect: '/home',
    title: 'Create Reservation',
    maps: {},
    schema: {
        type: 'object',
        required: ['dates'],
        properties: {
        }
    },
    uiSchema: {
        'restaurantId': {
            'ui:widget': 'hidden'
        },
        'date': {
            'ui:widget': 'hidden'
        },
        'invite': {
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