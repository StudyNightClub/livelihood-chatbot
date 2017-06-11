const commonConfig = {
  lineChannelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  lineChannelSecret: process.env.LINE_CHANNEL_SECRET || '',
  livelihoodServerRoot: process.env.LIVELIHOOD_SERVER_URL,
  settingServerRoot: process.env.SETTING_SERVER_URL,
  settingAccessToken: process.env.SETTING_ACCESS_TOKEN,
  port: process.env.PORT || 3000
}

module.exports = commonConfig
