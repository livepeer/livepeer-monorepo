const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})
const nextConfig = {
  target: 'serverless',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  env: {
    THREEBOX_ENABLED: true,
  },
  webpack(config, options) {
    config.resolve.alias['scrypt'] = require.resolve('scrypt.js/js.js')
    return config
  },
}

module.exports = withMDX(nextConfig)
