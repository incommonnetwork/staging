import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'react-bulma-components/src/components/heading';


const Title = ({ size = 2, title, subtitle, color, style = {} }) => (
    <div style={{ paddingBottom: '1rem', textAlign: 'center', ...style }}>
        <Heading size={size} renderAs="p" style={{ marginTop: '0rem', color }}>
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
    size: PropTypes.number,
    style: PropTypes.object
};

export default Title;