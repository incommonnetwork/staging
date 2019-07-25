import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'react-bulma-components/src/components/heading';


const Title = ({ size = 2, title, subtitle, color }) => (
    <div style={{ textAlign: 'center' }}>
        <Heading size={size} spaced={true} renderAs="p" style={{ color }}>
            {title}
        </Heading>
        <Heading subtitle renderAs="i" style={{ color }}>
            {subtitle}
        </Heading>
    </div>
);


Title.propTypes = {
    title: PropTypes.string.isRequired,
    color: PropTypes.string,
    subtitle: PropTypes.string,
    size: PropTypes.number
};

export default Title;