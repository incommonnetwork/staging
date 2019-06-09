const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH;

const client = require('twilio')(TWILIO_SID, TWILIO_AUTH);

module.exports = client;
