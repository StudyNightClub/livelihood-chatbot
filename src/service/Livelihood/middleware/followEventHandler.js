const emoji = require('node-emoji')

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
        const livelihoodClient = ctx.clients.Livelihood
        // TODO: handle connection error with livelihood control server
        await livelihoodClient.post('/user', {
          userId: e.source.userId,
          userNickname: e.source.profile.displayName,
          timestamp: +new Date()
        })

        ctx.store.onboard.set(e.source.userId, 'incoming')

        respondEvents.push({
          target: e.replyToken,
          event: 'follow',
          type: 'reply',
          message: [
            { type: 'text', text: `${e.source.profile.displayName} 您好` },
            {
              type: 'text',
              text: emoji.emojify('一起來看看你的周遭，政府正準備偷偷幹嘛:anguished:')
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
