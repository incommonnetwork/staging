import React from 'react';

import Protected from '../layouts/protected';
import { NarrowColumn } from '../layouts/columns';
import Card from '../layouts/card';

import Form from '../components/form';
import formContext from '../schemas/register_form';

import Router from '../utils/router';

const context = {
    ...formContext,
    submit_service_done: () => {
        Router.push('/thank_you_register');
        // console.log('done');
    }
};

const Register = () => {


    return (
        <Protected>
            <NarrowColumn>
                <Card>
                    <Form context={context} id={'register'} />
                </Card>
            </NarrowColumn>
        </Protected>
    );
};

export default Register;