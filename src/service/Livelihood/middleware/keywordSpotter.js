const utils = require('../utils')

module.exports = () => {
  return async (ctx, next) => {
    const incomingEvents = ctx.state.incomingEvents
    const respondEvents = []

    const noKeywordEvents = incomingEvents.reduce((res, event) => {
      if (event.type !== 'message') return

      const message = event.message
      switch (message.text) {
        case '我的個人設定':
          respondEvents.push({
            target: event.replyToken,
            event: 'keyword',
            type: 'reply',
            message: utils.settingButtonMessage(
              ctx.clients.Setting.getSettingPageURL(event.source.userId)
            )
          })
          return res
        case '看看民生預報':
          respondEvents.push({
            target: event.replyToken,
            event: 'keyword',
            type: 'reply',
            message: utils.mapButtonMessage(
              (async () => {
                const mapURL = await ctx.clients.Livelihood.requestMapButtonURL(
                  event.source.userId
                )
                return mapURL && typeof mapURL === 'string'
                  ? mapURL
                  : 'https://www.google.com.tw/maps/place/%E5%8F%B0%E5%8C%97101+No.+7,+Section+5,+Xinyi+Road,+Xinyi+District,+Taipei+City,+110/@25.0339031,121.5623212,17z/data=!3m1!4b1!4m5!3m4!1s0x3442abb6da9c9e1f:0x1206bcf082fd10a6!8m2!3d25.0339639!4d121.5644722'
              })()
            )
          })
          return res
        default:
          return [...res, event]
      }
    }, [])

    ctx.state.outgoingEvents = [...ctx.state.outgoingEvents, ...respondEvents]
    if (noKeywordEvents.length === 0) {
      return
    }
    await next()
  }
}
