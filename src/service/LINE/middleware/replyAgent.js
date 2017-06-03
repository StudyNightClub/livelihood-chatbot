module.exports = () => {
  return async (ctx, next) => {
    await next()

    const events = ctx.state.outgoingEvents
    const client = ctx.clients.LINE

    const results = await Promise.all(
      events.map(async e => {
        if (e.event === 'whoami') {
          const userProfile = await client.getProfile(e.userId)
          e.message = [
            {
              type: 'text',
              text: `你的名字，${userProfile.displayName}`
            },
            {
              type: 'text',
              text: `和身分證字號，${e.userId}`
            }
          ]
        }
        switch (e.type) {
          case 'reply':
            return client.replyMessage(e.target, e.message)
          case 'push':
            return client.pushMessage(e.target, e.message)
          default:
            throw new TypeError('Unknown handler for LINE client!')
        }
      })
    )

    ctx.state.serviceResponses = results
    ctx.body = {}
  }
}
