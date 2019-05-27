
const webpack = require('webpack')

const withSass = require('@zeit/next-sass')
const withTM = require('next-transpile-modules');


const isStaging = (process.env.NODE_ENV) === 'staging'
const assetPrefix = isStaging ? '/staging' : ''

module.exports = withSass(withTM({
    transpileModules: ['react-bulma-components', '@statecharts/xstate-viz'],
    sassLoaderOptions: {
        includePaths: ["./client"]
    },
    assetPrefix,
    env: {
        ASSET_PREFIX: assetPrefix
    }
}))