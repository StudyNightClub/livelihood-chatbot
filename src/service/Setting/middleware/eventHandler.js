const emoji = require('node-emoji')

module.exports = () => {
  return async (ctx, next) => {
    const lineClient = ctx.clients.LINE
    const incomingEvent = ctx.state.incomingEvent

    // switch (incomingEvent.type) {
    //   case 'initialize':
    if (ctx.store.onboard.getUserState(incomingEvent.userId) === 'engaged') {
      ctx.store.onboard.fire(incomingEvent.userId, 'doneSetting')
      ctx.state.serviceResponses = [
        ...ctx.state.serviceResponses,
        await lineClient.pushMessage(incomingEvent.userId, [
          {
            type: 'text',
            text: emoji.emojify('太好了，你已經設定完成囉:sparkles:')
          },
          {
            type: 'text',
            text: emoji.emojify(
              '本服務將會根據你的個人化設定，適時推播各種政府民生公告喔！\n讓你不會再被突然的停水、停電、及道路搶修給困擾到，快適的度過每一天:wink:'
            )
          }
        ])
      ]
    }
    //     break
    //   default:
    // }

    ctx.body = {}
  }
}
