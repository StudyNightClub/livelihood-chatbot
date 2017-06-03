const Client = require('../client')

module.exports = () => {
  return async (ctx, next) => {
    let events = ctx.request.fields.events || ctx.request.body.events

    events = await Promise.all(
      events.map(async e => {
        if (e.type !== 'follow') return Promise.resolve(e)

        const client = new Client(ctx.config)
        const userProfileResponse = await client.getProfile(e.source.userId)
        const userProfile = await userProfileResponse.json()
        e.source.profile = userProfile
        return Promise.resolve(e)
      })
    )

    ctx.request.events = events
    ctx.response.events = []
    await next()
  }
}
