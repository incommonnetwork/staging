/* global alert */
import React from 'react';
import Protected from '../layouts/protected';
import Tabs from '../layouts/tabs';
import Form from '../components/form';


const context = {
    form_submit_label: 'Save',


    schema: {
        'type': 'object',
        'required': [
            'firstName',
            'city',
            'state',
            'dinnerTime',
            'availability',
            'notice'
        ],
        'properties': {
            'firstName': {
                'type': 'string',
                'title': 'First name'
            },
            'city': {
                'type': 'string',
                'title': 'City'
            },
            'state': {
                'type': 'string',
                'title': 'State'
            },
            'telephone': {
                'type': 'string',
                'title': 'Telephone',
                'minLength': 10
            },
            'textInvites': {
                'title': 'Text Invites',
                'description': 'Would you like to receive invites via sms, in addition to email?',
                'type': 'boolean'
            },
            'dinnerTime': {
                'title': 'Dinner Time',
                'type': 'string',
                'description': 'When do you like to eat dinner?',
                'enum': [
                    '4:00 PM',
                    '5:00 PM',
                    '6:00 PM',
                    '7:00 PM',
                    '8:00 PM'
                ],
                'default': '7:00 PM'
            },
            'availability': {
                'title': 'Availability',
                'description': 'what days would you like to recieve invites for',
                'type': 'array',
                'items': {
                    'type': 'string',
                    'enum': [
                        'Sunday',
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday'
                    ]
                },
                'uniqueItems': true
            },
            'notice': {
                'title': 'Availability',
                'description': 'how much time do you need to make plans?',
                'type': 'string',
                'enum': [
                    'A Couple Hours',
                    'A Day',
                    'Two or more days'
                ],
                'default': 'A Couple Hours'
            },
            'diet': {
                'title': 'Diet',
                'description': 'Do you have any dietary restrictions?',
                'type': 'array',
                'items': {
                    'type': 'string',
                    'enum': [
                        'Vegetarian',
                        'Vegan',
                        'Gluten-Free'
                    ]
                },
                'uniqueItems': true
            }
        }
    },
    uiSchema: {
        'dinnerTime': {
            'ui:widget': 'select'
        },
        'availability': {
            'ui:widget': 'checkboxes',
            'ui:options': {
                'inline': true
            }
        },
        'notice': {
            'ui:widget': 'select'
        },
        'diet': {
            'ui:widget': 'checkboxes'
        }
    },
    validate: (formData, errors) => {
        return errors;
    },
    onSubmit: (send) => ({ formData }) => send({
        type: 'SUBMIT',
        formData
    }),

    submit_service: () => {
        alert('you have reached the end of the demo');
    },

    submit_service_done: () => { }
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