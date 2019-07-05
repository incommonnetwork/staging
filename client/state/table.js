import { Machine, assign } from 'xstate';
import getApp from '../utils/feathers';

export default (id) => Machine({
    id: `${id}_table`,
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
                },
                UPDATE_FILTER: {
                    actions: assign({
                        filter: (context, { filter }) => filter
                    })
                },
                SELECT_FILTER: {
                    actions: assign({
                        filter: (context, { filter }) => filter,
                        query: () => ({})
                    })
                },
                SUBMIT_FILTER: {
                    target: 'loading',
                    actions: assign({
                        query: ({ filter }) => ({
                            [filter.field.toLowerCase()]: filter.value
                        })
                    })
                },
                RESET_FILTER: {
                    target: 'loading',
                    actions: assign({
                        query: () => ({}),
                        filter: () => ({})
                    })
                }
            }
        }
    }
});