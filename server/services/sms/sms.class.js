const url = require('url')
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const getPage = pathname => {
    const app = require('./../../app');
    const port = app.get('port');
    const opts = { pathname, port }
    /* eslint-disable no-fallthrough */
    switch (process.env.NODE_ENV) {
        case 'staging':
            opts.pathname = `/staging${opts.pathname}`
        case 'production':
            opts.hostname = 'www.incommon.dev'
            opts.protocol = 'https'
            break
        case 'development':
        case 'test':
        default:
            opts.hostname = 'localhost'
            opts.protocol = 'http'
    }
    /* eslint-enable no-fallthrough */

    return url.format(opts);
}

/* eslint-disable no-unused-vars */
class Service {
    constructor(options) {
        this.options = options || {};
    }

    async create(data, params) {
        const twiml = new MessagingResponse();

        if (!params.user) {
            twiml.message(`Thanks for reaching out! visit ${getPage('/sign_up')}`);
        }

        return twiml.toString()

    }
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
