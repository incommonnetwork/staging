//https://itnext.io/next-js-app-on-github-pages-768020f2b65e

import React from 'react';
import PropTypes from 'prop-types';

import NextJsLink from 'next/link';

const assetPrefix = process.env.ASSET_PREFIX;

const Link = ({ href, children, id }) => (
    <NextJsLink href={href} as={`${assetPrefix}${href}`}>
        <div id={id}>
            {children}
        </div>
    </NextJsLink>
);

Link.propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    id: PropTypes.string.isRequired
};

export default Link;