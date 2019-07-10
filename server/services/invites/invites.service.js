// Initializes the `invites` service on path `/invites`
const createService = require('feathers-sequelize');
const createModel = require('../../models/invites.model');
const hooks = require('./invites.hooks');

module.exports = function (app) {
    const Model = createModel(app);
    const paginate = app.get('paginate');

    const options = {
        Model,
        paginate
    };

    // Initialize our service with any options it requires
    app.use('/invites', createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('invites');

    service.hooks(hooks);
};
