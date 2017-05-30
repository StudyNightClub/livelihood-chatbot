const commonConfig = require('./common')

const prodConfig = Object.assign(commonConfig, {
  logger: false
})

module.exports = prodConfig
