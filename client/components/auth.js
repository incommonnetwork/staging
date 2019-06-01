import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Navbar from 'react-bulma-components/src/components/navbar';
import Loader from 'react-bulma-components/src/components/loader';

import { useMachine } from '@xstate/react';
import authMachine from '../state/auth.js';

import Link from './link';

const signed_out = () => (
    <Fragment>
        <Navbar.Item>
            <Link href='/sign_in' id='nav_signin'>
                Sign In
            </Link>
        </Navbar.Item >

        <Navbar.Item >
            <Link href='/sign_up' id='nav_signup'>
                Sign up
            </Link>
        </Navbar.Item >
    </Fragment>
);


const signed_in = ({ current, send }) => (
    <Navbar.Item onClick={() => send('SIGN_OUT')}>
        {current.matches('signing_out') ? (<Loader />) : 'Sign Out'}
    </Navbar.Item>
);

signed_in.propTypes = {
    current: PropTypes.object.isRequired,
    send: PropTypes.func.isRequired
};

const button_fragments = { signed_in, signed_out, init: signed_out, signing_out: signed_out };

const Auth = () => {
    const [current, send] = useMachine(authMachine);
    const _button_fragment = button_fragments[current.value];

    return (
        <_button_fragment current={current} send={send} />
    );
};

export default Auth;