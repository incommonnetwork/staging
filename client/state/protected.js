/* global location */
import { Machine, assign } from 'xstate';
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
                    target: 'authorize',
                    actions: assign({
                        userId: (context, { data: { userId } }) => userId
                    })
                },
                onError: {
                    actions: (context) => Router.push(`/sign_up?redirect=${context.route}${location.search ? '&' + location.search.substr(1) : ''}`)
                }
            }
        },
        authorize: {
            invoke: {
                id: 'authorize',
                src: async (context) => {
                    if (!context.role) return;
                    const app = await getApp();
                    const user = await app.service('users').get(context.userId);
                    if (user.roles.split(',').indexOf(context.role) === -1) throw new Error('unauthorized');
                },
                onDone: {
                    target: 'signed_in'
                },
                onError: {
                    actions: () => Router.push('/home')
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