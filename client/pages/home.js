import React from 'react';
import Protected from '../layouts/protected';
import Tabs from '../layouts/tabs';
import Form from '../components/form';


const context = {
    form_submit_label: 'Save',


    schema: {
        type: 'object',
        required: [],
        properties: {}
    },
    uiSchema: {},
    validate: (formData, errors) => {
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
            <Tabs tabs={tabs} id="home" />
        </Protected>
    );
};

export default Home;