const utils = require('../utils')

module.exports = () => {
  return async (ctx, next) => {
    const incomingEvents = ctx.state.incomingEvents
    const respondEvents = []
    const client = ctx.clients.Livelihood

    const noLocationEvents = incomingEvents.reduce((res, event) => {
      if (event.type !== 'message') return

      const message = event.message
      if (message.type === 'location') {
        const notificationInfo = async () => {
          return await client.userRequestNotification(
            event.source.userId,
            message.latitude,
            message.longitude
          )
        }
        if (
          ctx.store.onboard.getUserState(event.source.userId) === 'incoming'
        ) {
          ctx.store.onboard.fire(event.source.userId, 'sharedLocation')
          respondEvents.push({
            target: event.replyToken,
            type: 'reply',
            message: [
              utils.onboardingPushNotification(notificationInfo),
              {
                type: 'text',
                text: '左右滑動圖片看看'
              },
              {
                type: 'text',
                text: '"隨時比別人搶先知道要停水、停電的時間！\n\n現在就設定：\n<你感興趣的地點>、<不想被打擾的時間>、<想主動收到的通知類型>。\n（還有你家馬路要施工的預報通知喔！）"'
              },
              {
                type: 'image',
                originalContentUrl: 'https://glacial-falls-53180.herokuapp.com/img/tutorial.png',
                previewImageUrl: 'https://glacial-falls-53180.herokuapp.com/img/tutorial.png'
              }
            ]
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
