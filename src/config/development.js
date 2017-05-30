const commonConfig = require('./common')

const devConfig = Object.assign(commonConfig, {
  logger: true
})

module.exports = devConfig
