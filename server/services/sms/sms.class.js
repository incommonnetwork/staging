const url = require('url');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const getPage = pathname => {
    pathname = `/-${pathname}`;
    const app = require('./../../app');
    const port = app.get('port');
    const opts = { pathname };
    /* eslint-disable no-fallthrough */
    switch (process.env.NODE_ENV) {
        case 'staging':
            opts.pathname = `/staging${opts.pathname}`;
        case 'production':
            opts.hostname = 'www.incommon.dev';
            opts.protocol = 'https';
            break;
        case 'development':
        case 'test':
            if (process.env.TEST_ENV === 'staging') {
                opts.hostname = 'www.incommon.dev';
                opts.protocol = 'https';
                opts.pathname = `/staging${opts.pathname}`;
                break;
            }
        default:
            opts.hostname = 'localhost';
            opts.protocol = 'http';
            opts.port = port;
    }
    /* eslint-enable no-fallthrough */

    return url.format(opts);
};

/* eslint-disable no-unused-vars */
class Service {
    constructor(options) {
        this.options = options || {};
    }

    async create(data, params) {
        const twiml = new MessagingResponse();

        if (!params.code) {
            twiml.message('Unrecognized code, are you sure you typed it correctly? Please try again');
        } else if (!params.user) {
            twiml.message(`Thanks for reaching out! visit ${getPage('/sign_up')}?c=${params.code.id}&p=${params.phone.id} to finish signing up`);
        } else {
            twiml.message(`Successfully registered with code : ${params.code.text}, visit ${getPage('/home')} to manage how you recieve invites`);
        }

        return twiml.toString();

    }
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
