require('dotenv').config()

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})

const nextConfig = {
  target: 'serverless',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  env: {
    THREEBOX_ENABLED: true,
    FORTMATIC_API_KEY: process.env.FORTMATIC_API_KEY,
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    PORTIS_DAPP_ID: process.env.PORTIS_DAPP_ID,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    })
    config.resolve.alias['scrypt'] = require.resolve('scrypt.js/js.js')
    return config
  },
}

module.exports = withMDX(nextConfig)
