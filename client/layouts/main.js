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
    children: PropTypes.array.isRequired
};

export default Main;

