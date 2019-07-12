/* global window */
import getApp from '../utils/feathers';
import RestaurantLocation from '../components/restaurant_location';
import moment from 'moment';

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
        'location': {
            'ui:widget': RestaurantLocation
        },
        'dates': {
            'ui:widget': 'checkboxes'
        },
    },
    form_submit_label: 'RSVP',
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
        const restaurant = await app.service('restaurants').get(invite.restaurantId);
        const neighborhood = await app.service('neighborhoods').get(restaurant.neighborhoodId);

        const location = {
            name: restaurant.name,
            address: restaurant.address,
            neighborhood: neighborhood.neighborhood,
            city: neighborhood.city,
            map: restaurant.map
        };


        const schema = {
            title: `RSVP for Dinner: ${moment(invite.date).format('dddd, MMMM Do')}`,
            type: 'object',
            required: ['total'],
            properties: {
                time: {
                    title: '7:30 PM',
                    type: 'null'
                },
                location: {
                    title: location.name,
                    default: JSON.stringify(location),
                    type: 'string'
                },
                total: {
                    title: 'Additional Guests',
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