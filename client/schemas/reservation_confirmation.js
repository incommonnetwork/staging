/* global window */
import getApp from '../utils/feathers';
import RestaurantLocation from '../components/restaurant_location';
import 'url-search-params-polyfill';
import fromEntries from 'fromentries';

import moment from 'moment';

export default {
    redirect: '/home',
    title: 'Create Neighborhood',
    noSubmit: true,
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
    form_init: async () => {
        const app = await getApp();
        const query = fromEntries(new URLSearchParams(window.location.search));

        const reservation = await app.service('reservations').get(query.id);
        const invite = await app.service('invites').get(reservation.inviteId);
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
            title: `Confirmation for Dinner: ${moment(reservation.date).format('dddd, MMMM Do')}`,
            type: 'object',
            required: [],
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
                    title: `Total Guests: ${reservation.total}`,
                    type: 'null'
                }
            }
        };
        return { schema };
    },
    submit_service: () => { },
    submit_service_done: () => {
        throw new Error('submit_service_done() NOT IMPLEMENTED');
    }
};