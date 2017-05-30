const commonConfig = {
  lineChannelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  lineChannelSecret: process.env.LINE_CHANNEL_SECRET || '',
  port: process.env.PORT || 3000
}

module.exports = commonConfig
