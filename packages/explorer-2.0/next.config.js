module.exports = {
  target: 'serverless',
  env: {
    THREEBOX_ENABLED: true,
  },
  webpack(config, options) {
    config.resolve.alias['scrypt'] = require.resolve('scrypt.js/js.js')
    return config
  },
}
