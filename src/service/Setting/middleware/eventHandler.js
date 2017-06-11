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
              '生活 Chat 寶會專注於你的個人設定，在適當的時機，提早通知你政府重要的民生公告訊息。\n讓你不再被麻煩的停水、停電、無預警的道路施工給困擾著，輕鬆地度過每一天:wink:'
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
