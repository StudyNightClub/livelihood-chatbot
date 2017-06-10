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
              ctx.client.Setting.getSettingPageURL(event.source.userId)
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
                return await ctx.clients.Livelihood.post('/map', {
                  userId: event.source.userId
                })
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
