/* global location */
import React from 'react';
import Protected from '../layouts/protected';
import Tabs from '../layouts/tabs';
import Table from '../components/table';

import getApp from '../utils/feathers';
import rfc822 from '../utils/rfc822';

const tabs = [
    {
        label: 'Users',
        element: Table,
        props: {
            id: 'users',
            columns: [
                {
                    label: 'id'
                }, {
                    label: 'email'
                }
            ],
            create: {
                redirect: '/home',
                schema: {
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
                    const created = await app.service('users').create(formData);
                    return created;
                },
                submit_service_done: () => {
                    location.reload();
                }
            }
        }
    }
];


const Home = () => {
    return (
        <Protected role="admin">
            <Tabs tabs={tabs} id="admin" />
        </Protected>
    );
};

export default Home;