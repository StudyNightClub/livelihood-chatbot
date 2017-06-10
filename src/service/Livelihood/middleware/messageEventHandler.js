const emoji = require('node-emoji')

module.exports = () => {
  return async (ctx, next) => {
    const events = ctx.state.incomingEvents

    const respondEvents = events.map(event => {
      if (ctx.store.onboard.get(event.source.userId) === 'incoming') {
        return {
          target: event.replyToken,
          type: 'reply',
          message: [
            {
              type: 'text',
              text: emoji.emojify('噢:disappointed_relieved:')
            },
            {
              type: 'text',
              text: emoji.emojify('請先試著分享位置看看，或是直接去個人化設定進行設定呦:relaxed:')
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
              text: emoji.emojify('是自然語言:scream::scream::scream:')
            }
          ]
        }
      }
    })
    ctx.state.outgoingEvents = [...ctx.state.outgoingEvents, ...respondEvents]

    await next()
  }
}
