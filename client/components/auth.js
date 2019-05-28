import React, { Fragment } from 'react';

import Navbar from 'react-bulma-components/src/components/navbar';
import Button from 'react-bulma-components/src/components/button';

import { useMachine } from '@xstate/react';
import authMachine from '../state/auth.js';

import Link from './link';

const signed_out = () => (
    <Fragment>
        <Link href='/sign_in' id='nav_signin'>
            <Button >
                Sign In
            </Button>
        </Link>
        <Link href='/sign_up' id='nav_signup'>
            <Button >
                Sign up
            </Button>
        </Link>
    </Fragment >
);


const signed_in = () => (
    <Fragment>
        <Link href='/' id='nav_signout'>
            <Button >
                Sign Out
            </Button>
        </Link>
    </Fragment>
);


const button_fragments = { signed_in, signed_out, init: signed_out };

const Auth = () => {
    const [current] = useMachine(authMachine);
    const _button_fragment = button_fragments[current.value];

    return (
        <Navbar.Item >
            <_button_fragment />
        </Navbar.Item>
    );
};

export default Auth;