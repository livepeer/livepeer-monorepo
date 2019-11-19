const path = require('path')

module.exports = {
  target: 'serverless',
  webpack: (config, { webpack }) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    })
    config.plugins.push(new webpack.IgnorePlugin(/^(?:electron|ws)$/))
    return config
  },
}
