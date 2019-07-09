// Initializes the `registrations` service on path `/registrations`
const createService = require('feathers-sequelize');
const createModel = require('../../models/registrations.model');
const hooks = require('./registrations.hooks');

module.exports = function (app) {
    const Model = createModel(app);
    const paginate = app.get('paginate');

    const options = {
        Model,
        paginate
    };

    // Initialize our service with any options it requires
    app.use('/registrations', createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('registrations');

    service.hooks(hooks);
};
