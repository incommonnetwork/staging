import Router from 'next/router';

const assetPrefix = process.env.ASSET_PREFIX;

const _push = Router.push.bind(Router);

Router.push = (path) => _push(`${assetPrefix}${path}`);

export default Router;