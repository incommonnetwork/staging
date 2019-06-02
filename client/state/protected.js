import { Machine } from 'xstate';
import getApp from '../utils/feathers';
import Router from '../utils/router';


export default Machine({
    id: 'protected',
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
                    actions: (context) => Router.push(`/sign_in?redirect=${context.route}`)
                }
            }
        },
        signed_in: {
            on: {
                SIGN_OUT: {
                    actions: () => Router.push('/')
                }
            }
        }
    }
});