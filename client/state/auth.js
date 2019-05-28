import { Machine, send } from 'xstate';
import getApp from './feathers';


const authenticate = async (context, event) => {
    const app = await getApp(context.api);
    const res = await app.authenticate(event.credentials);
    return res;
};

export default Machine({
    id: 'auth',
    initial: 'init',
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
                        SIGN_IN: 'signing_in',
                        SIGN_UP: 'signing_up'
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
                },

                signing_up: {
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
});