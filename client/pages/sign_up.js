/* global window */
import React from 'react';

import Main from '../layouts/main';
import Card from '../layouts/card';
import { NarrowColumn } from '../layouts/columns';

import Form from '../components/form';

import Router from '../utils/router';
import getApp from '../utils/feathers';
import rfc822 from '../utils/rfc822';
import 'url-search-params-polyfill';

const SignUp = () => {
    return (
        <Main>
            <NarrowColumn>
                <Card>
                    <Form context={context} id={'sign_up'} />
                </Card>
            </NarrowColumn>
        </Main>
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
        const query = Object.fromEntries(new URLSearchParams(window.location.search));

        const app = await getApp();
        const created = await app.service('users').create(formData, {
            query
        });
        await app.authenticate({
            strategy: 'local',
            ...formData
        });
        return created;
    },
    submit_service_done: (context, { data: { id } }) => {

        const query = Object.fromEntries(new URLSearchParams(window.location.search));
        const path = Router.query.redirect || context.redirect;
        delete query.redirect;
        const queryParams = Object.keys(query).map(k => `${k}=${query[k]}`).join('&');

        Router.push(`${path}?user=${id}${queryParams ? '&' + queryParams : ''}`);
    }
};

export default SignUp;