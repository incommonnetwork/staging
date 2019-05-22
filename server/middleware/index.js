
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
    if (process.env.NODE_ENV !== 'production') {
        const next = require('./next');
        app.get('*', next());
    }
};
