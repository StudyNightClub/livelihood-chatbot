const emoji = require('node-emoji')

module.exports = () => {
  return async (ctx, next) => {
    const lineClient = ctx.clients.LINE
    const incomingEvent = ctx.state.incomingEvent
    const userId = incomingEvent.userId || incomingEvent.id

    // switch (incomingEvent.type) {
    //   case 'initialize':
    if (ctx.store.onboard.getUserState(userId)) {
      ctx.store.onboard.fire(userId, 'doneSetting')
      ctx.state.serviceResponses = [
        ...(ctx.state.serviceResponses || []),
        await lineClient.pushMessage(userId, [
          {
            type: 'text',
            text: emoji.emojify('太好了，你已經設定完成囉:sparkles:')
          },
          {
            type: 'text',
            text: emoji.emojify(
              '生活 Chat 寶會根據您的個人設定，適時推播各類政府民生公告。\n讓你不再被突然的停水、停電、及道路搶修給困擾到，快適的度過每一天:wink:'
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
