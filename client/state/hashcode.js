/* global location */
import { Machine } from 'xstate';

import Router from '../utils/router';
import getApp from '../utils/feathers';

const wait = () => new Promise(res => setTimeout(res, 100));

export default Machine({
    id: 'hashcode',
    initial: 'init',
    states: {
        init: {
            invoke: {
                id: 'initHashCode',
                src: async () => {
                    if (location.hash) {
                        const codeText = location.hash.substr(1);
                        const app = await getApp();
                        const codes = await app.service('codes').find({
                            query: {
                                text: codeText
                            }
                        });
                        if (codes.total) {
                            const code = codes.data[0];
                            Router.push(`/register?code=${code.id}`);
                            while (true) { // eslint-disable-line no-constant-condition
                                await wait();
                            }
                        }

                    }
                },
                onDone: {
                    target: 'done'
                }
            }
        },
        done: {

        }
    }
});