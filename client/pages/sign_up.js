import React from 'react';
import Main from '../layouts/main';

import 'bootstrap/dist/css/bootstrap.css';

import Card from 'react-bulma-components/src/components/card';
import Form from 'react-jsonschema-form';

import { useMachine } from '@xstate/react';
import signUpMachine from '../state/sign_up.js';


const SignUp = () => {
    const [current] = useMachine(signUpMachine);
    const { SignUp: { schema, uiSchema, validate } } = current.meta;

    return (
        <Main>
            <Card>
                <Form
                    schema={schema}
                    uiSchema={uiSchema}
                    validate={validate} />
            </Card>
        </Main>
    );
};

export default SignUp;