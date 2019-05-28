import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Navbar from 'react-bulma-components/src/components/navbar';
import Button from 'react-bulma-components/src/components/button';

import { useMachine } from '@xstate/react';
import authMachine from '../state/auth.js';

const signed_out = ({ send }) => (
    <Fragment>
        <Button onClick={() => send('SIGN_IN')}>
            Sign In
        </Button>
        <Button onClick={() => send('SIGN_UP')}>
            Sign up
        </Button>
    </Fragment>
);

signed_out.propTypes = {
    send: PropTypes.func.isRequired
};

const signed_in = ({ send }) => (
    <Fragment>
        <Button onClick={() => send('SIGN_OUT')}>
            Sign In
        </Button>
    </Fragment>
);

signed_in.propTypes = {
    send: PropTypes.func.isRequired
};

const button_fragments = { signed_in, signed_out, init: signed_out };

// const signing_in = ({ send }) => (
//     <Fragment>
//     </Fragment>
// );

// const signing_out = ({ send }) => {
//     <Fragment>
//     </Fragment>;
// };

// const modal_fragments = { signing_in, signing_out };


const Auth = () => {
    const [current, send] = useMachine(authMachine);
    const _button_fragment = button_fragments[current.value];

    return (
        <Navbar.Item id='nav_signup'>
            <_button_fragment send={send} />
        </Navbar.Item>
    );
};

export default Auth;