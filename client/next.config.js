
const webpack = require('webpack')

const withSass = require('@zeit/next-sass')
const withTM = require('next-transpile-modules');


const isStaging = (process.env.NODE_ENV) === 'staging'
const assetPrefix = isStaging ? '/staging' : ''

module.exports = withSass(withTM({
    transpileModules: ['react-bulma-components'],
    sassLoaderOptions: {
        includePaths: ["./client"]
    },
    assetPrefix,
    webpack: config => {
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env.ASSET_PREFIX': JSON.stringify(assetPrefix),
            }),
        )

        return config
    },
}))