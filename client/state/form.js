import { Machine, assign } from 'xstate';

export default Machine({
    id: 'form',
    initial: 'form_init',
    states: {
        form_init: {
            invoke: {
                id: 'form_init',
                src: async (context, event) => {
                    if (context.form_init) return context.form_init(context, event);
                    return {};
                },
                onDone: {
                    target: 'form_input',
                    actions: assign({
                        schema: (context, event) => event.data.schema || context.schema,
                        maps: (context, event) => event.data.maps || context.maps,
                        uiSchema: (context, event) => event.data.uiSchema || context.uiSchema
                    })
                },
                onError: {
                    target: 'error',
                    actions: assign({
                        error: (context, event) => event.data
                    })
                }
            }
        },
        form_input: {
            on: {
                SUBMIT: 'form_submit'
            },
        },
        form_submit: {
            invoke: {
                id: 'signUp',
                src: async (context, event) => context.submit_service(event, context),
                onDone: {
                    actions: (context, result) => context.submit_service_done(context, result)
                },
                onError: {
                    target: 'error',
                    actions: assign({
                        error: (context, event) => {
                            return event.data;
                        }
                    })
                }
            }
        },
        error: {
            entry: [(context) => context.submit_service_error ? context.submit_service_error() : null],
            on: {
                CONTINUE: 'form_input'
            }
        }
    }
});