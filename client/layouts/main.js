import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Container from 'react-bulma-components/src/components/container';
import Header from '../components/header';

const Main = ({ children }) => (
    <Fragment>
        <Header />
        <Container>
            {children}
        </Container>
    </Fragment>
);

Main.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default Main;

