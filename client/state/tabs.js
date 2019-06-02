import { Machine, assign } from 'xstate';


export default Machine({
    id: 'auth',
    initial: 'waiting',
    strict: true,
    states: {
        waiting: {
            on: {
                TAB_SWITCH: {
                    target: 'switching',
                    actions: assign({
                        active: (context, { label }) => {
                            if (context.tabs.filter((definition) => definition.label === label).length === 0) {
                                throw new Error(`unknown tab ${label}`);
                            }
                            return label;
                        }
                    })
                }
            }
        },
        switching: {
            on: {
                '': {
                    target: 'waiting'
                }
            }
        }
    }
});