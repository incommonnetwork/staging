import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bulma-components/src/components/card';

const CardLayout = ({ children }) => (
    <Card style={{ padding: '2em', marginTop: '2em' }}>
        {children}
    </Card>
);

CardLayout.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

const CardHeader = Card.Header;

export { CardHeader as Header };

export default CardLayout;