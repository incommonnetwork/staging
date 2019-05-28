import { Machine, send } from 'xstate';
import getApp from './feathers';

const signUp = async (context, event) => {
    const app = await getApp();
    return app.service('users').create(event.data, context);
};

export default Machine({
    id: 'SignUp',
    initial: 'form_input',
    meta: {
        schema: {
            title: 'Todo',
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
            if (formData.password !== formData.confirm_password) {
                errors.confirm_password.addError('Passwords don\'t match');
            }
            return errors;
        }
    },
    states: {
        form_input: {
            on: {
                SUBMIT: 'form_submit'
            },
        },
        form_submit: {
            invoke: {
                id: 'signIn',
                src: signUp,
                onDone: {
                    actions: send('SIGNED_IN')
                },
                onError: {
                    target: 'error'
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