module.exports = () => {
  return async (ctx, next) => {
    const incomingEvents = ctx.state.incomingEvents
    const client = ctx.clients.Livelihood

    incomingEvents.forEach((res, event) => {
      if (event.type !== 'message') return

      const message = event.message
      if (message.type === 'location') {
        client.post('/notification', {
          latitude: message.latitude,
          longitude: message.longitude
        })
        if (ctx.store.onboard.get(event.source.userId)) {
          ctx.store.onboard.set(event.source.userId, 'engaged') // TODO: create a FSM class wrap this
        }
        return
      } else if (message.type === 'text') {
        // TODO: handle sharing location with text
      }
    })

    await next()
  }
}
