const next = require('next');

const nextApp = next({
    dir: './client',
    dev: (['production', 'test', 'travis'].indexOf(process.env.NODE_ENV) < 0) ? true : false,
});
const handle = nextApp.getRequestHandler();

module.exports = {
    nextApp,
    handle,
};
