require('dotenv').config()

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})

const nextConfig = {
  target: 'serverless',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  env: {
    THREEBOX_ENABLED: true,
    CONTROLLER_ADDRESS_RINKEBY: '0xa268aea9d048f8d3a592dd7f1821297972d4c8ea',
    CONTROLLER_ADDRESS_MAINNET: '0xf96d54e490317c557a967abfa5d6e33006be69b3',
    RPC_URL_1: 'https://mainnet.infura.io/v3/39df858a55ee42f4b2a8121978f9f98e',
    RPC_URL_4: 'https://rinkeby.infura.io/v3/39df858a55ee42f4b2a8121978f9f98e',
    FORTMATIC_API_KEY: process.env.FORTMATIC_API_KEY,
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    PORTIS_DAPP_ID: process.env.PORTIS_DAPP_ID,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
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

module.exports = withMDX(nextConfig)
