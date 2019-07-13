import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { useMachine } from '@xstate/react';
import Loader from 'react-bulma-components/src/components/loader';

import hashcodeMachine from '../state/hashcode';

const Hash = ({ children }) => {
    const [current] = useMachine(hashcodeMachine);

    if (current.matches('init')) return (<Loader />);

    return (
        <Fragment>
            {children}
        </Fragment>
    );
};

Hash.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};


export default Hash;