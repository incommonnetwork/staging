import React from 'react'

import Main from '../layouts/main'
import { NarrowColumn } from '../layouts/columns'
import Card from '../layouts/card'

import Form from '../components/form'
import formContext from '../schemas/register_form'

const context = {
    ...formContext,
    submit_service_done: () => {
        console.log('done')
    }
}

const Register = () => {


    return (
        <Main>
            <NarrowColumn>
                <Card>
                    <Form context={context} id={'register'} />
                </Card>
            </NarrowColumn>
        </Main>
    )
}

export default Register