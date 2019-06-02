import React from 'react';
import Protected from '../layouts/protected';
import Tabs from '../layouts/tabs';
import Form from '../components/form';

import rfc822 from '../utils/rfc822';

const context = {
    user: {},
    schema: {
        title: 'Sign Up',
        type: 'object',
        required: ['email', 'password', 'confirm_password'],
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
    form_submit_done: () => { }
};

const Settings = () => (
    <Form context={context} id="settings" />
);

Settings.propTypes = {};


const tabs = [
    {
        label: 'Settings',
        element: Settings
    }
];


const Home = () => {
    return (
        <Protected>
            <Tabs tabs={tabs} />
        </Protected>
    );
};

export default Home;