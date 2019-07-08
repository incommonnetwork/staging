import React from 'react';

import Main from '../layouts/main';
import { NarrowColumn } from '../layouts/columns';
import Card from '../layouts/card';
import Form from '../components/form';

import Router from '../utils/router';
import getApp from '../utils/feathers';
import rfc822 from '../utils/rfc822';

const SignIn = () => {
    return (
        <Main>
            <NarrowColumn>
                <Card>
                    <Form context={context} id={'sign_in'} />
                </Card>
            </NarrowColumn>
        </Main>
    );
};

const context = {
    redirect: '/home',
    schema: {
        title: 'Sign In',
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', title: 'email' },
            password: { type: 'string', title: 'Password' }
        }
    },
    uiSchema: {
        password: {
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
        return errors;
    },
    onSubmit: (send) => ({ formData }) => send({
        type: 'SUBMIT',
        formData
    }),
    submit_service: async ({ formData }) => {
        const app = await getApp();
        await app.authenticate({
            strategy: 'local',
            ...formData
        });
        const { data: [{ id }] } = await app.service('users').find({ email: formData.email });

        return { id };
    },
    submit_service_done: (context, { data: { id } }) => Router.push(`${Router.query.redirect || context.redirect}?user=${id}`)
};

export default SignIn;