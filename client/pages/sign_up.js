import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { useMachine } from '@xstate/react';
import signUpMachine from '../state/sign_up';

import Main from '../layouts/main';
import { NarrowColumn } from '../layouts/columns';

import 'bootstrap/dist/css/bootstrap.css';

import Card from 'react-bulma-components/src/components/card';
import Button from 'react-bulma-components/src/components/button';
import Heading from 'react-bulma-components/src/components/heading';

import Form from 'react-jsonschema-form';

const SignUpForm = ({ current: { value, meta: { SignUp: { schema, uiSchema, validate, onSubmit } } }, send }) => (
    <Form
        disabled={value === 'form_submit'}
        schema={schema}
        uiSchema={uiSchema}
        validate={validate}
        onSubmit={onSubmit(send)}
    >
        <Button
            className="is-primary"
            fullwidth
            loading={value === 'form_submit'}
            type="submit">
            Submit
        </Button>
    </Form>
);

SignUpForm.propTypes = {
    current: PropTypes.object.isRequired,
    send: PropTypes.func.isRequired
};


const ErrorElement = ({ current, send }) => (
    <Fragment>
        <Heading>Sign Up Error</Heading>
        {current.context && current.context.error && current.context.error.message}
        <Button onClick={() => send('CONTINUE')}>
            Try Again
        </Button>
        <p>
            If errors persist, please email ryan@incommon.dev
        </p>
    </Fragment>
);

ErrorElement.propTypes = {
    current: PropTypes.object.isRequired,
    send: PropTypes.func.isRequired
};

const SignUp = () => {
    const [current, send] = useMachine(signUpMachine);

    const Element = current.matches('form_input') || current.matches('form_submit') ? SignUpForm
        : current.matches('error') ? ErrorElement
            : null;

    return (
        <Main>
            <NarrowColumn>
                <Card style={{ padding: '2em', margin: '2em' }}>
                    <Element current={current} send={send} />
                </Card>
            </NarrowColumn>
        </Main >
    );
};

export default SignUp;