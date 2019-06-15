const { authenticate } = require('@feathersjs/authentication').hooks;
const { Forbidden, NotImplemented } = require('@feathersjs/errors');
const nodemailer = require('nodemailer');

const mailer = require('../../mailer');

const {
    hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

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

const addRoles = async (context) => {
    const { app, result } = context;
    const sequelizeClient = app.get('sequelizeClient');
    const userId = result.id;

    const user_roles = await sequelizeClient.model('user_roles').findAll({
        where: {
            userId,
        }
    });

    const roles = [];
    for (const role_ret of user_roles) {
        const roleId = role_ret.dataValues.roleId;
        const role = await sequelizeClient.model('roles').findByPk(roleId);
        roles.push(role.dataValues.type);
    }
    context.dispatch = {
        roles: roles.join(','),
        ...(context.dispatch || context.result)
    };

    return context;
};

const addCodes = async (context) => {
    const { app, result, dispatch } = context;
    const to_mod = dispatch || result;
    const sequelizeClient = app.get('sequelizeClient');
    const userId = result.id;
    const user_model = await sequelizeClient.model('users').findByPk(userId);
    const interests = await user_model.getInterests();
    context.dispatch = {
        interests,
        ...to_mod
    };
};

const addPhone = async (context) => {
    const { app, result, dispatch } = context;
    const to_mod = dispatch || result;
    const sequelizeClient = app.get('sequelizeClient');
    const userId = result.id;
    const user_model = await sequelizeClient.model('users').findByPk(userId);
    const phone = await user_model.getPhone();
    context.dispatch = {
        phone,
        ...to_mod
    };
};

const authorize = async (context) => {
    const { user, query } = context.params;

    /* eslint-disable no-fallthrough */
    switch (context.method) {
        case 'create':
            if (context.params.headers.authorization) {
                const strategy = context.data.strategy;
                delete context.data.strategy;
                context = await authenticate('jwt')(context);
                context.data.strategy = strategy;
                const is_admin = await isAdmin(context);
                if (!is_admin) throw new Forbidden();
            } else if (query.roles && query.roles.split(',').indexOf('admin') >= 0) {
                throw new Forbidden();
            }
            break;
        case 'find':
            // only allow a non admin user to find themselves
            if (user && !(await isAdmin(context))) {
                context.params.query = user;
            }
            break;
        case 'get':
            if (user && !(await isAdmin(context))) {
                context.id = user.id;
            }
        case 'update':
        case 'patch':
        case 'remove':
            if (user && (!(await isAdmin(context)) && (user.id !== context.id))) throw new Forbidden('Not Authorized');
            break;
        default:
            throw new NotImplemented(__dirname);

    }
    /* eslint-enable no-fallthrough */

    return context;
};

const email_confirm = async (context) => {
    const email = context.result.email;
    const info = await mailer.sendMail({
        from: 'InCommon <noreply@bots.incommon.dev>',
        to: email,
        subject: 'Welcome to InCommon',
        text: `
            This email address was used to register an account at incommon.dev
            If you did not do this, please email ryan@incommon.dev to have yourself removed from our database
        `
    });

    context.result.email_confirmation = nodemailer.getTestMessageUrl(info);
};

const associate_code = async (context) => {
    if (!context._query.c) return;

    const sequelizeClient = context.app.get('sequelizeClient');

    const user = await sequelizeClient.models.users.findByPk(context.result.id);
    const code = await sequelizeClient.models.codes.findByPk(Number.parseInt(context._query.c));

    await user.addInterest(code);
};

const associate_phone = async (context) => {
    if (!context._query.p) return;

    const sequelizeClient = context.app.get('sequelizeClient');

    const user = await sequelizeClient.models.users.findByPk(context.result.id);
    const phone = await sequelizeClient.models.phones.findByPk(Number.parseInt(context._query.p));

    user.phoneId = phone.get('id');
    await user.save();
};

const persistQuery = async (context) => {
    context._query = JSON.parse(JSON.stringify(context.params.query || {}));
};


module.exports = {
    before: {
        all: [persistQuery],
        find: [authenticate('jwt'), authorize],
        get: [authenticate('jwt'), authorize],
        create: [hashPassword(), authorize],
        update: [hashPassword(), authenticate('jwt'), authorize],
        patch: [hashPassword(), authenticate('jwt'), authorize],
        remove: [authenticate('jwt'), authorize]
    },

    after: {
        all: [
            // Make sure the password field is never sent to the client
            // Always must be the last hook
            protect('password')
        ],
        find: [],
        get: [addRoles, addCodes, addPhone],
        create: [email_confirm, associate_code, associate_phone],
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
