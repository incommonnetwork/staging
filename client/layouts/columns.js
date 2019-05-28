import React from 'react';
import PropTypes from 'prop-types';

import Columns from 'react-bulma-components/src/components/columns';
const { Column } = Columns;


const ColumnLayout = (sizes) => {
    const layout = ({ children }) => (
        <Columns breakpoint="mobile" style={{ justifyContent: 'center' }}>
            <Column {...sizes}>
                {children}
            </Column>
        </Columns>
    );

    layout.propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ])
    };

    return layout;
};

const NarrowColumn = ColumnLayout({
    mobile: {
        size: 'three-quarters',
    },
    tablet: {
        size: 'two-thirds',
    },
    desktop: {
        size: 'half',
    },
    widescreen: {
        size: 'one-third',
    },
    fullhd: {
        size: 'one-third',
    }
});

const WideColumn = ColumnLayout({
    mobile: {
        size: 'three-quarters',
    },
    tablet: {
        size: 'three-quarters',
    },
    desktop: {
        size: 'two-thirds',
    },
    widescreen: {
        size: 'half',
    },
    fullhd: {
        size: 'half',
    }
});

export { NarrowColumn, WideColumn };