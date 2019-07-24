import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'react-bulma-components/src/components/heading';


const Title = ({ size = 2, title, subtitle }) => (
    <p style={{ textAlign: 'center' }}>
        <Heading size={size} spaced={true} renderAs="p">
            {title}
        </Heading>
        <Heading subtitle renderAs="i">
            {subtitle}
        </Heading>
    </p>
);


Title.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    size: PropTypes.number
};

export default Title;