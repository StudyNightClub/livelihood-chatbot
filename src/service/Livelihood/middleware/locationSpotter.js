module.exports = () => {
  return async (ctx, next) => {
    const incomingEvents = ctx.state.incomingEvents
    const client = ctx.clients.Livelihood

    const noLocationEvents = incomingEvents.reduce((res, event) => {
      if (event.type !== 'message') return

      const message = event.message
      if (message.type === 'location') {
        client.post('/notification', {
          latitude: message.latitude,
          longitude: message.longitude
        })
        ctx.store.onboard.fire(event.source.userId, 'sharedLocation')
        return res
      } else if (message.type === 'text') {
        // TODO: handle sharing location with text
      }

      return [...res, event]
    }, [])

    if (noLocationEvents.length === 0) {
      return
    }
    await next()
  }
}
