const path = require('path')

module.exports = {
  target: 'serverless',
  webpack: (config, { webpack }) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    })
    // https://spectrum.chat/zeit/general/error-while-building-project~cf3cadfd-6370-4dae-8399-84c8ab2b4841?m=MTU2MDI1NTY2NDYxNw==
    config.resolve.alias['scrypt.js'] = 'scryptsy'
    config.plugins.push(new webpack.IgnorePlugin(/^(?:electron|ws)$/))
    return config
  },
}
