import React from 'react';

import { useMachine } from '@xstate/react';
import signInMachine from '../state/sign_in';

import CardLayout from '../layouts/card';


import Form from '../components/form';
import ErrorElement from '../components/error';

const SignIn = () => {
    const [current, send] = useMachine(signInMachine);

    const Element = current.matches('form_input') || current.matches('form_submit') ? Form
        : current.matches('error') ? ErrorElement
            : null;

    return (
        <CardLayout>
            <Element current={current} send={send} id={'sign_in'} />
        </CardLayout>
    );
};

export default SignIn;