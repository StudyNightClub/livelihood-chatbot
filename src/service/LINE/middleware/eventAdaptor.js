const Client = require('../client')

module.exports = () => {
  return async (ctx, next) => {
    let events = ctx.request.fields.events || ctx.request.body.events

    events = await Promise.all(
      events.map(async e => {
        if (e.type !== 'follow') return Promise.resolve(e)

        const client = new Client(ctx.config)
        e.source.profile = await client.getProfile(e.source.userId)

        return Promise.resolve(e)
      })
    )

    ctx.state.incomingEvents = events
    ctx.state.outgoingEvents = []
    await next()
  }
}
