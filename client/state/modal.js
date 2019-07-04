import { Machine } from 'xstate';

export default Machine({
    id: 'modal',
    initial: 'modal_closed',
    states: {
        modal_closed: {
            on: {
                OPEN: 'modal_opened'
            },
        },
        modal_opened: {
            on: {
                CLOSE: 'modal_closed'
            }
        }
    }
});