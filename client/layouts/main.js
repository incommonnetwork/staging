import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Header from '../components/header';

const Main = ({ children }) => (
    <Fragment>
        <Header />
        {children}
    </Fragment>
);

Main.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default Main;

