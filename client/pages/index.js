import React from 'react';

import Main from '../layouts/main';
import { NarrowColumn } from '../layouts/columns';
import Card from '../layouts/card';

import Form from '../components/form';
import formContext from '../schemas/code_lookup_form';

import Router from '../utils/router';

const context = {
    ...formContext,
    submit_service_done: (ctx, code) => {
        Router.push(`/register?code=${code.data.id}`);
    }
};

const Register = () => {


    return (
        <Main>
            <NarrowColumn>
                <Card>
                    <Form context={context} id={'code_lookup'} />
                </Card>
            </NarrowColumn>
        </Main>
    );
};

export default Register;