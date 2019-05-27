//https://itnext.io/next-js-app-on-github-pages-768020f2b65e

import React from 'react';
import NextJsLink from 'next/link';

const assetPrefix = process.env.ASSET_PREFIX;

const Link = ({ href, ...rest }) => (
    <NextJsLink href={href} as={`${assetPrefix}${href}`} {...rest} />
);

export default Link;