import { Machine, assign } from 'xstate';
import Router from '../utils/router';
import getApp from '../utils/feathers';
import rfc822 from '../utils/rfc822';


export default Machine({
    id: 'SignUp',
    initial: 'form_input',
    context: {
        user: {}
    },
    meta: {
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
                errors.password.addError('Password must be between 8 and 32 characters')
            }
            if (formData.password !== formData.confirm_password) {
                errors.confirm_password.addError('Passwords don\'t match');
            }
            return errors;
        },
        onSubmit: (send) => ({ formData }) => send({
            type: 'SUBMIT',
            formData
        })
    },
    states: {
        form_input: {
            on: {
                SUBMIT: 'form_submit'
            },
        },
        form_submit: {
            invoke: {
                id: 'signUp',
                src: async (context, { formData }) => {
                    const app = await getApp();
                    const created = await app.service('users').create(formData, context);
                    await app.authenticate({
                        strategy: 'local',
                        ...formData
                    });
                    return created;
                },
                onDone: {
                    actions: (context, { data: { id } }) => Router.push(`/home?user=${id}`)
                },
                onError: {
                    target: 'error',
                    actions: assign({
                        error: (context, event) => event.data
                    })
                }
            }
        },
        error: {
            on: {
                CONTINUE: 'form_input'
            }
        }
    }
});