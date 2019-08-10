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
import fromEntries from 'fromentries';

const wait = () => new Promise(r => setTimeout(r, 100));

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
        title: 'Learn More',
        description: 'Fill out this form to learn when InCommon is available in your area',
        type: 'object',
        required: [
            'email',
            'city',
            'state',
            'country',
            'use'
        ],
        properties: {
            email: {
                type: 'string',
                title: 'email'
            },
            city: {
                type: 'string',
                title: 'City'
            },
            state: {
                type: 'string',
                title: 'State'
            },
            country: {
                type: 'string',
                title: 'Country'
            },
            use: {
                type: 'string',
                title: 'Use',
                description: 'Do you want to use InCommon as an individual, as a community, or as a restaurant?',
                enum: [
                    'Individual',
                    'Community',
                    'Restaurant'
                ]
            }
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
        const query = fromEntries(new URLSearchParams(window.location.search));

        const app = await getApp();

        const created = await app.service('users').create(formData, {
            query
        }).catch(async e => {
            if (e.errors[0].type === 'unique violation' && e.errors[0].path === 'email') {
                Router.push('/sign_in');
                return null;
            } else {
                throw e;
            }
        });

        if (!created) {
            // don't progress to next state, avoid UI jitter while browser is navigating
            while (true) { // eslint-disable-line no-constant-condition
                await wait();
            }
        }

        await app.authenticate({
            strategy: 'local',
            ...formData
        });
        return created;
    },
    submit_service_done: (context, { data: { id } }) => {

        const query = fromEntries(new URLSearchParams(window.location.search));
        const path = Router.query.redirect || context.redirect;
        delete query.redirect;
        const queryParams = Object.keys(query).map(k => `${k}=${query[k]}`).join('&');

        Router.push(`${path}?user=${id}${queryParams ? '&' + queryParams : ''}`);
    }
};

export default SignUp;