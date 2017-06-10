const utils = require('../utils')

module.exports = () => {
  return async (ctx, next) => {
    const incomingEvents = ctx.state.incomingEvents
    const respondEvents = []
    const client = ctx.clients.Livelihood

    const noLocationEvents = incomingEvents.reduce(async (res, event) => {
      if (event.type !== 'message') return

      const message = event.message
      if (message.type === 'location') {
        const notificationInfo = await client.post('/notification', {
          latitude: message.latitude,
          longitude: message.longitude
        })
        if (
          ctx.store.onboard.getUserState(event.source.userId) === 'incoming'
        ) {
          ctx.store.onboard.fire(event.source.userId, 'sharedLocation')
          respondEvents.push({
            target: event.replyToken,
            type: 'reply',
            message: utils.onboardingPushNotification(notificationInfo)
          })
        } else {
          respondEvents.push({
            target: event.replyToken,
            type: 'reply',
            message: utils.userRequestedNotification(notificationInfo)
          })
        }
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
