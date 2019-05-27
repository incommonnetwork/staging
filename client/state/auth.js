import { Machine, sendParent, send } from 'xstate'
import getApp from './feathers'


const authenticate = async (auth, opts) => {
    const app = await getApp()
    console.SIGN('authenticate', auth, opts)
    const res = await app.authenticate(auth)
    console.SIGN('authenticated?', res)
}

export default Machine({
    id: 'auth',
    initial: 'init',
    strict: true,
    states: {
        init: {
            invoke: {
                id: 'initAuth',
                src: authenticate,
                onDone: {
                    target: 'signed_in'
                },
                onError: {
                    target: 'signed_out'
                }
            }
        },
        signed_out: {
            initial: 'wait',
            on: {
                SIGNED_IN: 'signed_in'
            },
            states: {
                wait: {
                    on: {
                        SIGN_IN: 'signing_in'
                    }
                },

                signing_in: {
                    initial: 'form_input',
                    states: {
                        form_input: {
                            on: {
                                SUBMIT: 'form_submit'
                            },
                        },
                        form_submit: {
                            invoke: {
                                id: 'signIn',
                                src: authenticate,
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
                    },
                    on: {
                        CANCEL: 'wait'
                    }
                }
            }
        },
        signed_in: {
            on: {
                SIGN_OUT: 'signed_out'
            }
        }
    }
})