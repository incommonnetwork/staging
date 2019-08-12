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
    submit_service: async ({ formData }, context) => {
        const app = await getApp();
        const query = fromEntries(new URLSearchParams(window.location.search));

        const created = await app.service('rsvps').create({
            reservationId: context.reservation.id,
            phoneId: query.p,
            ...formData
        });
        return created;
    },
    form_init: async (context) => {
        const query = fromEntries(new URLSearchParams(window.location.search));
        if (!(query.p)) {
            Router.push('/');
        }

        const reservation = context.reservation;

        if (!reservation) {
            Router.push('/');
        }

        const restaurant = reservation.restaurant;

        const location = {
            id: 'restaurant_map',
            restaurantId: restaurant.id,
            name: restaurant.name,
            address: restaurant.address,
            city: restaurant.city,
            state: restaurant.state,
            map: restaurant.map
        };

        const schema = {
            title: restaurant.name,
            description: `${moment(reservation.date.split('.')[0]).format('dddd, MMMM Do h:mmA')}`,
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