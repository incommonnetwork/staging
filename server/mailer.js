const nodemailer = require('nodemailer');

const config = ['staging', 'production'].indexOf(process.env.NODE_ENV) === -1 ? {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'qswh62uymhz2x5cd@ethereal.email',
        pass: 'MPjp1xKSyfdWNFNBmy'
    }
} : {
    service: 'FastMail',
    auth: {
        user: 'noreply@bots.incommon.dev',
        pass: process.env.FASTMAIL_PASSWORD
    }
};

const transport = nodemailer.createTransport(config);

module.exports = transport;