
const webpack = require('webpack')

const withSass = require('@zeit/next-sass')
const withTM = require('next-transpile-modules');


const isStaging = (process.env.NODE_ENV) === 'staging'
const assetPrefix = isStaging ? '/staging' : ''

module.exports = withSass(withTM({
    exportPathMap: {
        '/': {page : '/'},
        '/signup': {page : '/signup'}
    },
    transpileModules: ['react-bulma-components'],
    sassLoaderOptions: {
        includePaths: ["./client"]
    },
    assetPrefix,
    env : {
        ASSET_PREFIX : assetPrefix
    }
}))