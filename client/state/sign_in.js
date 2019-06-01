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
                    await app.authenticate({
                        strategy: 'local',
                        ...formData
                    });
                    const { data: [{ id }] } = await app.service('users').find({ email: formData.email });

                    return { id };
                },
                onDone: {
                    actions: (context, { data: { id } }) => Router.push(`${Router.query.redirect || '/home'}?user=${id}`)
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