import { Machine, interpret } from 'xstate'

import userMachine from './user'

const incommon = Machine({
    id: 'incommon',
    type: 'parallel',
    initial: 'unknown',
    states: {
        unknown: {
            invoke: {
                id: 'user',
                src: userMachine
            }
        }
    }
})

let service = null

export default function getService() {
    return (service = service || interpret(incommon))
}