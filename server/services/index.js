const users = require('./users/users.service.js');
const roles = require('./roles/roles.service.js');
const sms = require('./sms/sms.service.js');
const codes = require('./codes/codes.service.js');
const cities = require('./cities/cities.service.js');
const rsvps = require('./rsvps/rsvps.service.js');
const restaurants = require('./restaurants/restaurants.service.js');
const reservations = require('./reservations/reservations.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
    app.configure(users);
    app.configure(roles);
    app.configure(sms);
    app.configure(codes);
    app.configure(cities);
    app.configure(rsvps);
    app.configure(restaurants);
    app.configure(reservations);
};
