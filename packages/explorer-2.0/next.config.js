require('dotenv').config()
const withTM = require('next-transpile-modules')(['@livepeer/ui'])

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})

const nextConfig = {
  target: 'serverless',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  env: {
    THREEBOX_ENABLED: true,
    CONTROLLER_ADDRESS: process.env.CONTROLLER_ADDRESS,
    POLL_CREATOR_ADDRESS: process.env.POLL_CREATOR_ADDRESS,
    RPC_URL_1: process.env.RPC_URL_1,
    RPC_URL_4: process.env.RPC_URL_4,
    SUBGRAPH: process.env.SUBGRAPH,
    FORTMATIC_API_KEY: process.env.FORTMATIC_API_KEY,
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    PORTIS_DAPP_ID: process.env.PORTIS_DAPP_ID,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    NETWORK: process.env.NETWORK,
  },
  webpack(config, { webpack }) {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    })
    config.plugins.push(new webpack.IgnorePlugin(/^(?:electron)$/))
    config.resolve.alias['scrypt'] = require.resolve('scrypt.js/js.js')
    return config
  },
}

module.exports = withTM(withMDX(nextConfig))
