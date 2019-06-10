const MessagingResponse = require('twilio').twiml.MessagingResponse;

/* eslint-disable no-unused-vars */
class Service {
    constructor(options) {
        this.options = options || {};
    }

    async create(data, params) {
        const twiml = new MessagingResponse();

        twiml.message('The Robots are coming! Head for the hills!');
        return twiml.toString();
    }
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
