const withSass = require('@zeit/next-sass')
const withTM = require('next-transpile-modules');

module.exports = withSass(withTM({
    transpileModules: ['react-bulma-components'],
    sassLoaderOptions: {
        includePaths: ["./client"]
    },
}))