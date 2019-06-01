import React from 'react';

import { useMachine } from '@xstate/react';
import signUpMachine from '../state/sign_up';

import CardLayout from '../layouts/card';


import Form from '../components/form';
import ErrorElement from '../components/error';

const SignUp = () => {
    const [current, send] = useMachine(signUpMachine);

    const Element = current.matches('form_input') || current.matches('form_submit') ? Form
        : current.matches('error') ? ErrorElement
            : null;

    return (
        <CardLayout>
            <Element current={current} send={send} />
        </CardLayout>
    );
};

export default SignUp;