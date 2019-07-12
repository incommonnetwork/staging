const { authenticate } = require('@feathersjs/authentication').hooks;
const { NotAuthorized } = require('@feathersjs/errors');

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
        throw new NotAuthorized();
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

module.exports = {
    before: {
        all: [authenticate('jwt'), isAdmin],
        find: [handleNullQueries],
        get: [],
        create: [addDate],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [addReservationToInvite],
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
