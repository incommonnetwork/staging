const { authenticate } = require('@feathersjs/authentication').hooks;
const { Unprocessable } = require('@feathersjs/errors');
const moment = require('moment');

const nodemailer = require('nodemailer');

const mailer = require('../../mailer');
const url = require('url');



const addRestaurant = async (context) => {
    const sequelizeClient = context.app.get('sequelizeClient');

    for (const inviteData of context.result.data) {
        const restaurant = await sequelizeClient.models.restaurants.findByPk(inviteData.restaurantId);
        inviteData.restaurant = restaurant.get('name');
    }
};


const addCodeAndUsers = async (context) => {
    const sequelizeClient = context.app.get('sequelizeClient');

    for (const inviteData of context.result.data) {
        const invite = await sequelizeClient.models.invites.findByPk(inviteData.id);
        const registrations = await invite.getRegistrations();
        const firstRegistration = registrations[0];
        const code = firstRegistration ? await firstRegistration.getCode() : null;
        inviteData.code = code ? code.get('text') : null;
        inviteData.users = registrations.length;
    }
};

const addCodeAndRestaurant = async (context) => {
    const sequelizeClient = context.app.get('sequelizeClient');

    const invite = await sequelizeClient.models.invites.findByPk(context.result.id);
    const registrations = await invite.getRegistrations();
    const firstRegistration = registrations[0];
    const code = await firstRegistration.getCode();
    const restaurant = await invite.getRestaurant();

    context.result.code = code.get('text');
    context.result.restaurant = restaurant.get('name');
};


const handleNullQueries = hook => {
    let where = Object.assign({}, hook.params.query);

    function transformQuery(obj) {
        Object.keys(obj).forEach(function (prop) {
            let value = obj[prop];
            if (value !== null && typeof value === 'object')
                obj[prop] = transformQuery(value);
            else if (value === 'NULL') //Yes currently i use uppercase null for this, maybe change it to lowercase
                obj[prop] = null;
        });
        return obj;
    }

    hook.params.query = transformQuery(where);
};

const getPage = pathname => {
    const app = require('./../../app');
    const port = app.get('port');
    const opts = { pathname };
    /* eslint-disable no-fallthrough */
    switch (process.env.NODE_ENV) {
        case 'staging':
            opts.pathname = `/staging${opts.pathname}`;
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


const emailInvitees = async (context) => {
    const app = context.app;
    const sequelizeClient = await app.get('sequelizeClient');
    const invite = await sequelizeClient.models.invites.findByPk(context.result.id);
    const restaurant = await sequelizeClient.models.restaurants.findByPk(context.result.restaurantId);

    const registrations = await invite.getRegistrations();


    const date_time = moment(invite.get('date'));

    context.result.email_confirmations = [];

    for (const registration of registrations) {
        const user = await registration.getUser();
        const email = user.get('email');

        const info = await mailer.sendMail({
            from: 'InCommon <noreply@bots.incommon.dev>',
            to: email,
            subject: 'InCommon: Invitation to Dinner!',
            text: `
                You are invited to dinner at ${restaurant.get('name')} at 7:30 PM, ${date_time.format('dddd MMMM, Do')},
                Please rsvp at the following link:
                ${getPage('/rsvp')}?invite=${invite.id}
            `
        });

        context.result.email_confirmations.push(nodemailer.getTestMessageUrl(info));
    }
};

const checkRegistrations = async (context) => {
    if (!context.data.registrations || !context.data.registrations.length) {
        throw new Unprocessable('registrations are required');
    }
};

const addRegistrations = async (context) => {
    for (const id of context.data.registrations) {
        await context.app.service('registrations').patch(id, {
            inviteId: context.result.id
        });
    }
};

module.exports = {
    before: {
        all: [authenticate('jwt')],
        find: [handleNullQueries],
        get: [],
        create: [checkRegistrations],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [],
        find: [addRestaurant, addCodeAndUsers],
        get: [addCodeAndRestaurant],
        create: [addRegistrations, emailInvitees],
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
