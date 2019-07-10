// Initializes the `rsvps` service on path `/rsvps`
const createService = require('feathers-sequelize');
const createModel = require('../../models/rsvps.model');
const hooks = require('./rsvps.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/rsvps', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('rsvps');

  service.hooks(hooks);
};
