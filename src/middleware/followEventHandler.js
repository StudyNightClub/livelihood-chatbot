const emoji = require('node-emoji')
const ControlServerClient = require('../service/control/client')

module.exports = () => {
  return async (ctx, next) => {
    const events = ctx.request.events.reduce(
      (output, e) => {
        if (e.type === 'follow') output.follow.push(e)
        else output.notFollow.push(e)
        return output
      },
      { follow: [], notFollow: [] }
    )
    if (ctx.request.events.length === events.notFollow.length) await next()

    const respondEvents = []
    // wait until all follow events were handled
    await Promise.all(
      events.follow.map(async e => {
        /* post new user info to control server */
        const controlClient = new ControlServerClient(ctx.config)
        // TODO: handle connection error with control server
        await controlClient.post('/user', {
          userId: e.source.userId,
          userNickname: e.source.profile.displayName,
          timestamp: +new Date()
        })
        /* respond with hello, new user message */
        respondEvents.push({
          target: e.replyToken,
          event: 'follow',
          type: 'reply',
          message: [
            { type: 'text', text: `啊！是${e.source.profile.displayName}！！` },
            { type: 'text', text: emoji.emojify('感謝加我為好友呦:blush:') }
          ]
        })
        return Promise.resolve(e)
      })
    )
    ctx.response.events = [...ctx.response.events, ...respondEvents]

    // continuously process events if there exist other events
    if (events.notFollow.length > 0) {
      ctx.request.events = events.notFollow
      await next()
    }
  }
}
