const commonConfig = {
  lineChannelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  lineChannelSecret: process.env.LINE_CHANNEL_SECRET || '',
  controlServerRoot: process.env.LIVELIHOOD_SERVER_URL,
  port: process.env.PORT || 3000
}

module.exports = commonConfig
