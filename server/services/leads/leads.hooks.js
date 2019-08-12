const nodemailer = require('nodemailer');

const mailer = require('../../mailer');

const emailConfirmation = async (context) => {
    const email = context.result.email;
    const info = await mailer.sendMail({
        from: 'InCommon <noreply@bots.incommon.dev>',
        to: email,
        subject: 'Welcome to InCommon',
        text: `
            Thanks for signing up to learn more about InCommon!
            If you did not do this, please email ryan@incommon.dev to have yourself removed from our database
        `
    });

    context.result.email_confirmation = nodemailer.getTestMessageUrl(info);
};

module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [emailConfirmation],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
