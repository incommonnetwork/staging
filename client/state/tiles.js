import { Machine, assign } from 'xstate';

import getApp from '../utils/feathers';

export default Machine({
    id: 'tiles',
    initial: 'tiles_init',
    states: {
        tiles_init: {
            invoke: {
                id: 'tiles_init',
                src: async (context) => {
                    const app = await getApp();
                    const results = await app.service(context.service).find({ query: context.getQuery() });
                    return results;
                },
                onDone: {
                    target: 'tiles_done',
                    actions: assign({
                        values: (context, event) => context.makeValues(event.data),
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
        tiles_done: {
        },
        error: {

        }
    }
});