
const { authenticate } = require('@feathersjs/authentication').hooks;
const { NotAuthenticated, Forbidden } = require('@feathersjs/errors');
const smsclient = require('../../sms');
const url = require('url');

const isAdmin = async (context) => {
    const { app, params: { user } } = context;
    const sequelizeClient = app.get('sequelizeClient');

    const [adminRole] = await sequelizeClient.model('roles').findAll({
        where: {
            type: 'admin'
        }
    });

    if (!adminRole) return false;

    const [user_roles] = await sequelizeClient.model('user_roles').findAll({
        where: {
            userId: user.id,
            roleId: adminRole.dataValues.id
        }
    });

    if (!user_roles) {
        throw new NotAuthenticated();
    }
};

const checkCapacity = async (hook) => {
    const rsvp = hook.data;
    const app = hook.app;
    const reservation = await app.service('reservations').get(rsvp.reservationId);

    if (reservation.full) {
        throw new Forbidden('We\'re sorry, this reservation is full, please try another.');
    }

    const existing_rsvps = await app.service('rsvps').find({
        query: {
            reservationId: rsvp.reservationId
        }
    });

    const rsvp_total = rsvp.total;
    const current_total = existing_rsvps.data.map(({ total }) => total).reduce((tot, cur) => tot + cur, 0);
    const next_total = rsvp_total + current_total;

    if (next_total > reservation.capacity) {
        throw new Forbidden(`There is not enough room in this reservation for ${rsvp.total} more guests`);
    } else if (next_total === reservation.capacity) {
        await app.service('reservations').patch(reservation.id, {
            full: true
        });
    }
};

const getPage = pathname => {
    const app = require('./../../app');
    const port = app.get('port');
    const opts = { pathname };
    /* eslint-disable no-fallthrough */
    switch (process.env.NODE_ENV) {
        case 'staging':
            opts.pathname = `/staging${opts.pathname}/`;
        case 'production':
            opts.hostname = 'www.incommon.dev';
            opts.protocol = 'https';
            break;
        case 'development':
        case 'test':
            if (process.env.TEST_ENV === 'staging') {
                opts.hostname = 'www.incommon.dev';
                opts.protocol = 'https';
                opts.pathname = `/staging${opts.pathname}`;
                break;
            }
        default:
            opts.hostname = 'localhost';
            opts.protocol = 'http';
            opts.port = port;
    }
    /* eslint-enable no-fallthrough */

    return url.format(opts);
};

const smsConfirm = async hook => {
    const reservation = await hook.app.service('reservations').get(hook.data.reservationId);
    const restaurant = await hook.app.service('restaurants').get(reservation.restaurantId);
    const phone = await hook.app.service('phones').get(hook.data.phoneId);
    await smsclient.messages.create({
        body: `Your RSVP for Dinner at ${restaurant.name} for ${hook.data.total} has been recieved. visit ${getPage('/view_reservation')}?r=${reservation.id} for time and map info.`,
        to: phone.number,
        from: '+16467605264'
    }).catch(() => {
        return null;
    });
};

module.exports = {
    before: {
        all: [],
        find: [],
        get: [authenticate('jwt'), isAdmin],
        create: [checkCapacity],
        update: [authenticate('jwt'), isAdmin],
        patch: [authenticate('jwt'), isAdmin],
        remove: [authenticate('jwt'), isAdmin]
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [smsConfirm],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
