/* global window */
import getApp from '../utils/feathers';
import RestaurantLocation from '../components/restaurant_location';
import 'url-search-params-polyfill';

import moment from 'moment';
import fromEntries from 'fromentries';
import Router from '../utils/router';


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
        const query = fromEntries(new URLSearchParams(window.location.search));
        const inviteId = Number.parseInt(query.invite);
        const accepted = true;
        const created = await app.service('rsvps').create({ inviteId, accepted, total });
        return created;
    },
    form_init: async () => {

        const app = await getApp();
        const query = fromEntries(new URLSearchParams(window.location.search));
        if (!(query.reservation && query.phone)) {
            Router.push('/');
        }


        const reservation = await app.service('reservations').get(query.reservation).catch(() => {
            return null;
        });

        if (!reservation) {
            Router.push('/');
        }

        // if (!query.phone) {
        //     Router.push('/')
        // }

        const restaurant = reservation.restaurant;

        const location = {
            id: 'restaurant_map',
            restaurantId: restaurant.id,
            name: restaurant.name,
            address: restaurant.address,
            city: restaurant.city,
            map: restaurant.map
        };

        const schema = {
            title: `RSVP: \n${moment(reservation.date.split('.')[0]).format('dddd, MMMM Do h:mmA')}`,
            type: 'object',
            required: ['total'],
            properties: {
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