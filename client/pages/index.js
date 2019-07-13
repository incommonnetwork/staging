import React from 'react';

import Main from '../layouts/main';
import { NarrowColumn } from '../layouts/columns';
import Card from '../layouts/card';

import Form from '../components/form';
import formContext from '../schemas/code_lookup_form';
import HashCode from '../components/hashcode';

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
                    <HashCode>
                        <Form context={context} id={'code_lookup'} />
                    </HashCode>
                </Card>
            </NarrowColumn>
        </Main>
    );
};

export default Register;