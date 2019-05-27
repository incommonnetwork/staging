import { Machine, interpret } from 'xstate';
import getApp from './feathers';


const authenticate = async (auth, opts) => {
    const app = await getApp();
    console.log('authenticate', auth, opts);
    const res = await app.authenticate(auth);
    console.log('authenticated?', res);
};

const incommon = Machine({
    id: 'incommon',
    strict: true,
    type: 'parallel',
    states: {
        user: {
            initial: 'init',
            invoke: {
                id: 'auth',
                src: authenticate,
                onDone: {
                    target: 'logged_in'
                },
                onError: {
                    target: 'logged_out'
                }
            },
            states: {
                init: {
                    on: {
                        LOG_IN: 'logged_in',
                        LOG_OUT: 'logged_out'
                    }
                },
                logged_in: {
                    on: {
                        LOG_OUT: 'logged_out'
                    }
                },
                logged_out: {
                    on: {
                        LOG_IN: 'logged_in'
                    }
                }
            }
        }
    }
});

export default incommon;