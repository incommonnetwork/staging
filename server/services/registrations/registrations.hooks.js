const { authenticate } = require('@feathersjs/authentication').hooks;

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

    return !!user_roles;
};

const addUser = async (context) => {
    const _admin = await isAdmin(context);
    context.data.userId = _admin ? context.data.userId : context.params.user.id;
};

const populateFieldsFind = async (context) => {
    const sequelizeClient = context.app.get('sequelizeClient');

    for (const registrationData of context.result.data) {
        const user = await sequelizeClient.models.users.findByPk(registrationData.userId);
        registrationData.user = user ? user.get('email') : null;
        const code = await sequelizeClient.models.codes.findByPk(registrationData.codeId);
        registrationData.code = code ? code.get('code') : null;
        const neighborhood = await sequelizeClient.models.neighborhoods.findByPk(registrationData.neighborhoodId);
        registrationData.neighborhood = neighborhood ? neighborhood.get('neighborhood') : null;
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

const email_confirm = async (context) => {
    const app = context.app;
    const code = await app.get('sequelizeClient').models.codes.findByPk(context.result.codeId);

    const email = context.params.user.email;

    const info = await mailer.sendMail({
        from: 'InCommon <noreply@bots.incommon.dev>',
        to: email,
        subject: 'Welcome to InCommon',
        text: `
            Thanks for registering with code ${code.text},
            You'll receive an invite shortly to RSVP with your fellow attendees.
        `
    });

    context.result.email_confirmation = nodemailer.getTestMessageUrl(info);
};

const populateUserField = async (context) => {

    const _admin = await isAdmin(context);
    if (!_admin) {
        context.params.query.userId = context.params.user.id;
    }
};

module.exports = {
    before: {
        all: [authenticate('jwt')],
        find: [handleNullQueries],
        get: [],
        create: [addUser],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [],
        find: [populateFieldsFind, populateUserField],
        get: [],
        create: [email_confirm],
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
