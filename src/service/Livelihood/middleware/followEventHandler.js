const emoji = require('node-emoji')
const utils = require('../utils')

module.exports = () => {
  return async (ctx, next) => {
    if (ctx.state.incomingEvents.every(e => e.type !== 'follow')) {
      await next()
      return
    }
    /* separate follow and notFollow events */
    const events = ctx.state.incomingEvents.reduce(
      (output, e) => {
        if (e.type === 'follow') output.follow.push(e)
        else output.notFollow.push(e)
        return output
      },
      { follow: [], notFollow: [] }
    )

    const respondEvents = []
    // wait until all follow events were handled
    await Promise.all(
      events.follow.map(async e => {
        const settingClient = ctx.clients.Setting
        // TODO: handle connection error with setting server
        const settingResponse = await settingClient.createNewUser(
          e.source.userId,
          e.source.profile.displayName
        )
        ctx.state.serviceResponses = [
          ...ctx.state.serviceResponses,
          settingResponse
        ]

        ctx.store.onboard.fire(e.source.userId, 'followedMe')

        respondEvents.push({
          target: e.replyToken,
          event: 'follow',
          type: 'reply',
          message: [
            { type: 'text', text: `${e.source.profile.displayName} 您好` },
            {
              type: 'text',
              text: emoji.emojify('一起來看看你的周遭，政府正準備偷偷幹嘛:anguished:')
            },
            {
              type: 'carousel',
              altText: '試著分享隨意一個位置，看看政府正準備偷偷幹嘛',
              cards: utils.shareLocationCarouselMessage()
            },
            {
              type: 'text',
              text: '分享位置訊息教學圖'
            }
          ]
        })
        return Promise.resolve(e)
      })
    )
    ctx.state.outgoingEvents = [...ctx.state.outgoingEvents, ...respondEvents]

    // continuously process events if there exist other events
    if (events.notFollow.length > 0) {
      ctx.state.incomingEvents = events.notFollow
      await next()
    }
  }
}
