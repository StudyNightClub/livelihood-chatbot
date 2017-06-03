module.exports = () => {
  return async (ctx, next) => {
    let events = ctx.request.fields.events || ctx.request.body.events

    events = await Promise.all(
      events.map(async e => {
        if (e.type !== 'follow') return Promise.resolve(e)

        e.source.profile = await ctx.clients.LINE.getProfile(e.source.userId)
        return Promise.resolve(e)
      })
    )

    ctx.state.incomingEvents = events
    ctx.state.outgoingEvents = []
    await next()
  }
}
