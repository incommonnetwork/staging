import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bulma-components/src/components/button';
import Heading from 'react-bulma-components/src/components/heading';

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

export default ErrorElement;