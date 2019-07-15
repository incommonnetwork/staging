const { authenticate } = require('@feathersjs/authentication').hooks;
const { NotAuthenticated } = require('@feathersjs/errors');
const nodemailer = require('nodemailer');
const mailer = require('../../mailer');

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

const addDate = async (context) => {
    const { app } = context;
    const sequelizeClient = app.get('sequelizeClient');
    const invite = await sequelizeClient.model('invites').findByPk(context.data.inviteId);
    context.data.date = invite.get('date');
};

const addReservationToInvite = async (context) => {
    const { app } = context;
    const sequelizeClient = app.get('sequelizeClient');
    const invite = await sequelizeClient.model('invites').findByPk(context.data.inviteId);
    const reservation = await sequelizeClient.model('reservations').findByPk(context.result.id);
    await invite.setReservation(reservation);
};


const emailConfirmations = async (context) => {
    const app = context.app;
    const sequelizeClient = await app.get('sequelizeClient');
    const reservation = await sequelizeClient.model('reservations').findByPk(context.result.id);
    const invite = await reservation.getInvite();
    const restaurant = await invite.getRestaurant();
    const rsvps = await invite.getRsvps();

    context.result.email_confirmations = [];

    for (const rsvp of rsvps) {
        const user = await rsvp.getUser();
        const email = user.get('email');


        const info = await mailer.sendMail({
            from: 'InCommon <noreply@bots.incommon.dev>',
            to: email,
            subject: 'InCommon: You\'re all Set!',
            text: `
            You're group is reserved at ${restaurant.name} at ${invite.date}, 7:30 PM, tell the host you're reservations is under "common"
            Haver Fun! Here's a map to the restaurant if you need it: ${restaurant.map}

        `
        });

        context.result.email_confirmations.push(nodemailer.getTestMessageUrl(info));
    }
};

const addTotal = async (context) => {
    const sequelizeClient = await context.app.get('sequelizeClient');
    const reservation = await sequelizeClient.model('reservations').findByPk(context.result.id);
    const invite = await reservation.getInvite();
    const rsvps = await invite.getRsvps();

    let total = 0;
    for (const rsvp of rsvps) {
        total += rsvp.get('total');
    }
    context.result.total = total;
};


module.exports = {
    before: {
        all: [authenticate('jwt')],
        find: [handleNullQueries, isAdmin],
        get: [],
        create: [addDate, isAdmin],
        update: [isAdmin],
        patch: [isAdmin],
        remove: [isAdmin]
    },

    after: {
        all: [],
        find: [],
        get: [addTotal],
        create: [addReservationToInvite, emailConfirmations],
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
