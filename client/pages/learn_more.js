
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
    validate: (formData, errors) => {
        if (!rfc822(formData.email)) {
            errors.email.addError('Email address is not valid');
        }
        return errors;
    },
    onSubmit: (send) => ({ formData }) => send({
        type: 'SUBMIT',
        formData
    }),
    submit_service: async ({ formData }) => {

        const app = await getApp();

        const created = await app.service('leads').create(formData);

        return created;
    },
    submit_service_done: () => {
        Router.push('/thank_you_register');
    }
};

export default SignUp;