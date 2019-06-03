import { Machine, assign } from 'xstate';
import getApp from '../utils/feathers';

export default Machine({
    id: 'table',
    initial: 'loading',
    strict: true,
    context: {},
    states: {
        loading: {
            invoke: {
                id: 'loadTable',
                src: async (context) => {
                    const app = await getApp();
                    const result = await app.service(context.id).find({
                        query: context.query || {}
                    });
                    return result;
                },
                onDone: {
                    target: 'display',
                    actions: assign({
                        page: (context, { data }) => data
                    })
                }
            }
        },
        display: {
            on: {
                RELOAD: {
                    target: 'loading',
                    actions: assign({
                        query: (context, { query }) => query
                    })
                }
            }
        }
    }
});