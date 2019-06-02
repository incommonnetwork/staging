import React from 'react';

import CardLayout from '../layouts/card';
import Form from '../components/form';

import Router from '../utils/router';
import getApp from '../utils/feathers';
import rfc822 from '../utils/rfc822';

const SignUp = () => {
    return (
        <CardLayout>
            <Form context={context} id={'sign_up'} />
        </CardLayout>
    );
};

const context = {
    redirect: '/home',
    schema: {
        title: 'Sign Up',
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', title: 'email' },
            password: { type: 'string', title: 'Password' },
            confirm_password: { type: 'string', title: 'Confirm Password' }
        }
    },
    uiSchema: {
        password: {
            'ui:widget': 'password'
        },
        confirm_password: {
            'ui:widget': 'password'
        }
    },
    validate: (formData, errors) => {
        if (!rfc822(formData.email)) {
            errors.email.addError('Email address is not valid');
        }
        if (!(8 <= formData.password.length && formData.password.length <= 32)) {
            errors.password.addError('Password must be between 8 and 32 characters');
        }
        if (formData.password !== formData.confirm_password) {
            errors.confirm_password.addError('Passwords don\'t match');
        }
        return errors;
    },
    onSubmit: (send) => ({ formData }) => send({
        type: 'SUBMIT',
        formData
    }),
    submit_service: async ({ formData }) => {
        const app = await getApp();
        const created = await app.service('users').create(formData, context);
        await app.authenticate({
            strategy: 'local',
            ...formData
        });
        return created;
    },
    submit_service_done: (context, { data: { id } }) => Router.push(`${Router.query.redirect || context.redirect}?user=${id}`)
};

export default SignUp;