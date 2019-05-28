import dynamic from 'next/dynamic'

const StateChart = dynamic(
    () => import('@statecharts/xstate-viz').then(mod => mod.StateChart),
    {
        ssr: false
    }
)

export default StateChart