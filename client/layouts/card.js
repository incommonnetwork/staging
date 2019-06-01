import React from 'react';
import PropTypes from 'prop-types';

import Main from './main';
import { NarrowColumn } from './columns';

import Card from 'react-bulma-components/src/components/card';

const CardLayout = ({ children }) => (
    <Main>
        <NarrowColumn>
            <Card style={{ padding: '2em', margin: '2em' }}>
                {children}
            </Card>
        </NarrowColumn>
    </Main >
);

CardLayout.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default CardLayout;