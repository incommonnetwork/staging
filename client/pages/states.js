import Main from '../layouts/main'
import dynamic from 'next/dynamic'
import authMachine from '../state/auth.js'

const StateChart = dynamic(
    () => import('@statecharts/xstate-viz').then(mod => mod.StateChart),
    {
        ssr: false
    }
)



export default () => (
    <Main>
        <StateChart machine={`Machine(${JSON.stringify(authMachine.config)})`} withEditor={false} />
    </Main>
)