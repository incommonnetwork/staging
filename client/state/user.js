import { Machine } from 'xstate'

export default Machine({
    id: 'user',
    initial: 'start',
    states: {
        start: {}
    }
})