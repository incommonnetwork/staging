import { Machine, assign } from 'xstate';

export default Machine({
    id: 'SignUp',
    initial: 'form_input',
    states: {
        form_input: {
            on: {
                SUBMIT: 'form_submit'
            },
        },
        form_submit: {
            invoke: {
                id: 'signUp',
                src: async (context, event) => context.submit_service(event),
                onDone: {
                    actions: (context, result) => context.submit_service_done(context, result)
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