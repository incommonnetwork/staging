
const { authenticate } = require('@feathersjs/authentication').hooks;
const { NotAuthenticated } = require('@feathersjs/errors');

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

const addUser = async (context) => {
    context.data.userId = context.params.user.id;
};

const addCodeAndUser = async (context) => {
    const sequelizeClient = context.app.get('sequelizeClient');

    for (const rsvpData of context.result.data) {
        const rsvp = await sequelizeClient.models.rsvps.findByPk(rsvpData.id)
        const user = await rsvp.getUser()
        const invite = await sequelizeClient.models.invites.findByPk(rsvpData.inviteId)
        const registrations = await invite.getRegistrations();
        const firstRegistration = registrations[0];
        const code = await firstRegistration.getCode()

        rsvpData.user = user.get('email')
        rsvpData.code = code.get('text')
    }
}


module.exports = {
    before: {
        all: [authenticate('jwt')],
        find: [isAdmin],
        get: [isAdmin],
        create: [addUser],
        update: [isAdmin],
        patch: [isAdmin],
        remove: [isAdmin]
    },

    after: {
        all: [],
        find: [addCodeAndUser],
        get: [],
        create: [],
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
