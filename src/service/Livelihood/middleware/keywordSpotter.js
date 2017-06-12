const utils = require('../utils')

module.exports = () => {
  return async (ctx, next) => {
    const incomingEvents = ctx.state.incomingEvents
    const respondEvents = []

    let mapURL = ''
    await Promise.all(
      incomingEvents.map(async e => {
        if (e.message.text === '看看民生預報') {
          mapURL = await ctx.clients.Livelihood.requestMapButtonURL(
            e.source.userId
          )
        }
        return Promise.resolve(e)
      })
    )

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
        case '看看地圖預報':
          respondEvents.push({
            target: event.replyToken,
            event: 'keyword',
            type: 'reply',
            message: utils.mapButtonMessage(mapURL)
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
