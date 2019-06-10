const users = require('./users/users.service.js');
const roles = require('./roles/roles.service.js');
const sms = require('./sms/sms.service.js');
const codes = require('./codes/codes.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
    app.configure(users);
    app.configure(roles);
    app.configure(sms);
    app.configure(codes);
};
