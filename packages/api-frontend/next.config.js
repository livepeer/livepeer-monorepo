const withTM = require('next-transpile-modules')
const path = require('path')

module.exports = withTM({
  // target: 'serverless',
  // transpileModules: ["next-mui-helper"],
  webpack: (config, { webpack }) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    })
    config.resolve.alias['scrypt.js'] = path.resolve(
      __dirname,
      './node_modules/scrypt.js/js.js',
    )
    // https://spectrum.chat/zeit/general/error-while-building-project~cf3cadfd-6370-4dae-8399-84c8ab2b4841?m=MTU2MDI1NTY2NDYxNw==
    config.plugins.push(new webpack.IgnorePlugin(/^(?:electron|ws)$/))
    // config.resolve.alias['scrypt.js'] = 'js-scrypt'
    return config
  },
  exportPathMap: function() {
    return {
      '/': { page: '/' },
    }
  },
})
