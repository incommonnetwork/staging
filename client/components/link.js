//https://itnext.io/next-js-app-on-github-pages-768020f2b65e

import React from 'react';
import PropTypes from 'prop-types';

import NextJsLink from 'next/link';

const assetPrefix = process.env.ASSET_PREFIX;

const Link = ({ href, children }) => (
    <NextJsLink href={href} as={`${assetPrefix}${href}`}>
        {children}
    </NextJsLink>
);

Link.propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node
};

export default Link;