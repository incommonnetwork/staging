import { Machine } from 'xstate';
import getApp from '../utils/feathers';


export default Machine({
    id: 'auth',
    initial: 'init',
    states: {
        init: {
            invoke: {
                id: 'initAuth',
                src: async () => {
                    const app = await getApp();
                    const res = await app.authenticate();
                    return res;
                },
                onDone: {
                    target: 'signed_in'
                },
                onError: {
                    target: 'signed_out'
                }
            }
        },
        signed_out: {
            on: {
                SIGNED_IN: 'signed_in'
            }
        },
        signed_in: {
            on: {
                SIGN_OUT: 'signed_out'
            }
        }
    }
});