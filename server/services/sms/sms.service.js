// Initializes the `sms` service on path `/sms`
const createService = require('./sms.class.js');
const hooks = require('./sms.hooks');

module.exports = function (app) {
  
    const paginate = app.get('paginate');

    const options = {
        paginate
    };

    // Initialize our service with any options it requires
    app.use('/sms', createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('sms');

    service.hooks(hooks);
};
