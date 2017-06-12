module.exports = () => {
  return async (ctx, next) => {
    const incomingEvents = ctx.state.incomingEvents
    const respondEvents = []
    const client = ctx.clients.Livelihood

    const noLocationEvents = incomingEvents.reduce((res, event) => {
      if (event.type !== 'message') return

      const message = event.message
      if (message.type === 'location') {
        ctx.state.serviceResponses = [
          ...ctx.state.serviceResponses,
          (async () =>
            await client.userRequestNotification(
              event.source.userId,
              message.latitude,
              message.longitude
            ))()
        ]
        ctx.store.onboard.fire(event.source.userId, 'sharedLocation')

        return res
      } else if (message.type === 'text') {
        // TODO: handle sharing location with text
      }

      return [...res, event]
    }, [])

    ctx.state.outgoingEvents = [...ctx.state.outgoingEvents, ...respondEvents]
    if (noLocationEvents.length === 0) {
      return
    }
    await next()
  }
}
