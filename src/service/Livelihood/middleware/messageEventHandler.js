const emoji = require('node-emoji')

module.exports = () => {
  return async (ctx, next) => {
    const events = ctx.state.incomingEvents

    const respondEvents = events.map(event => {
      if (ctx.store.onboard.getUserState(event.source.userId) === 'incoming') {
        return {
          target: event.replyToken,
          type: 'reply',
          message: [
            {
              type: 'text',
              text: emoji.emojify('噢噢，請先試著按教學分享位置看看，或是直接去個人化設定進行設定呦:yum:')
            }
          ]
        }
      } else {
        return {
          target: event.replyToken,
          type: 'reply',
          message: [
            {
              type: 'text',
              text: '有使用上其他問題可以跟我說，我會盡快回覆你喔！'
            }
          ]
        }
      }
    })
    ctx.state.outgoingEvents = [...ctx.state.outgoingEvents, ...respondEvents]

    await next()
  }
}
