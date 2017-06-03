const Client = require('../client')

module.exports = () => {
  return async (ctx, next) => {
    await next()

    const events = ctx.state.outgoingEvents
    const client = new Client(ctx.config)

    const results = await Promise.all(
      events.map(async e => {
        if (e.event === 'whoami') {
          const userProfileResponse = await client.getProfile(e.userId)
          const userProfile = await userProfileResponse.json()
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

    ctx.state.serviceResponses = await Promise.all(
      results.map(result => result.json())
    )
    ctx.body = {}
  }
}
