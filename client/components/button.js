import React from 'react';
import PropTypes from 'prop-types';

import BulmaButton from 'react-bulma-components/src/components/button';

const Button = ({ children, onClick = () => { } }) => (
    <BulmaButton
        style={{
            margin: '1rem',
            backgroundColor: '#fffefeb0',
            borderWidth: '2px'
        }}
        onClick={onClick}>
        {children}
    </BulmaButton>
);


Button.propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default Button;