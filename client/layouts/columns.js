import React from 'react';
import PropTypes from 'prop-types';

import Columns from 'react-bulma-components/src/components/columns';
const { Column } = Columns;


const ColumnLayout = ({ children, sizes }) => (
    <Columns breakpoint="mobile" style={{ justifyContent: 'center' }}>
        <Column {...sizes}>
            {children}
        </Column>
    </Columns>
);

ColumnLayout.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    sizes: PropTypes.object.isRequired
};

const NarrowColumn = ({ children }) => (
    <ColumnLayout sizes={{
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
    }}>
        {children}
    </ColumnLayout>
);

NarrowColumn.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

const WideColumn = ({ children }) => (
    <ColumnLayout sizes={{
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
    }}>
        {children}
    </ColumnLayout>
);

WideColumn.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
export { NarrowColumn, WideColumn };