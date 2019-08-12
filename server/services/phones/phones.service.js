// Initializes the `phones` service on path `/phones`
const createService = require('feathers-sequelize');
const createModel = require('../../models/phones.model');
const hooks = require('./phones.hooks');

module.exports = function (app) {
    const Model = createModel(app);
    const paginate = app.get('paginate');

    const options = {
        Model,
        paginate
    };

    // Initialize our service with any options it requires
    app.use('/phones', createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('phones');

    service.hooks(hooks);
};
