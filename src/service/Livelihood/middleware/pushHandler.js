const lineCarouselTemplate = require('../../LINE/utils')
  .carouselMessageFormatter
const MessageFormatError = require('../../../exceptions').MessageFormatError

module.exports = () => {
  return async (ctx, next) => {
    const lineClient = ctx.clients.LINE
    const rawNotification = ctx.state.incomingEvent

    isRawNotificationValid(rawNotification)

    const pushNotifications = notificationFactory(rawNotification)
    try {
      ctx.state.serviceResponses = [
        await lineClient.pushMessage(rawNotification.userId, [
          { type: 'text', text: pushNotifications.altText },
          pushNotifications
        ])
      ]
      ctx.body = {}
    } catch (err) {
      ctx.response.status = 400
    }
  }
}

/**
 * Validate incoming raw data for pushing notification and throw exception if failed
 * @param {Object} rawNotification - Incoming raw data for pushing
 */
function isRawNotificationValid(rawNotification) {
  if (!rawNotification.category) {
    throw new MessageFormatError('body must contain category attribute!')
  }
  if (
    !rawNotification.notifications ||
    rawNotification.notifications.length <= 0
  ) {
    throw new MessageFormatError('notification must existed and contain data')
  }
}

/**
 * Generate pushing message depending on the category of request
 * @param {Object} rawNotification - Incoming raw data for pushing
 * @return {Object}
 */
function notificationFactory(rawNotification) {
  switch (rawNotification.category) {
    case 'userRequested':
    case 'userScheduled':
    case 'systemScheduled':
    case 'broadcast':
      return userRequestedFormMessage(rawNotification)
    default:
      throw new TypeError('Unknown type of notification!')
  }
}

/**
 * Generate the userRequested category of push notification
 * @param {Object} raw - Incoming raw data for pushing
 * @return {Object}
 */
function userRequestedFormMessage(raw) {
  const notificationsByTypes = {}
  raw.notifications.forEach(notification => {
    if (!notificationsByTypes[notification.type])
      notificationsByTypes[notification.type] = []
    notificationsByTypes[notification.type].push(notification)
  })
  const altText = altTextTemplate(notificationsByTypes)
  const cards = Object.keys(notificationsByTypes).map(type => {
    const notificationType = notificationTypeFactory(type)
    const notificationDetail = notificationDetailFactory(
      type,
      notificationsByTypes[type]
    )
    return {
      thumbnailImageUrl: thumbnailFactory(type),
      title: `明天要${notificationType}`,
      text: notificationDetail.length >= 60
        ? notificationDetail.slice(0, 60)
        : notificationDetail,
      actions: [
        {
          type: 'uri',
          label: `看看${notificationType}範圍`,
          uri: raw.mapURL[type]
        }
      ]
    }
  })
  return lineCarouselTemplate(altText, cards)
}

/**
 * Generate the description of card of carousel message depending on type of the notification
 * @param {String} type - type of the notification
 * @param {Object} notifications - notifications in same types
 * @return {String}
 */
function notificationDetailFactory(type, notifications) {
  switch (type) {
    case 'water_outage':
    case 'power_outage':
      return waterPowerOutageContent(notifications)
    case 'road_work':
      return roadWorkContent(notifications)
    default:
      throw new TypeError('Unknown type of notification!')
  }
}

/**
 * Generate the description of card of carousel message on waterOutage and powerOutage type
 * @param {Array} notifications - notifications in same waterOutage and powerOutage type
 * @return {String}
 */
function waterPowerOutageContent(notifications) {
  return notifications.reduce((output, notify) => {
    if (output) output += '\n'
    return (output += `${notify.startDate.slice(5)}~${notify.endDate.slice(5)} ${notify.startTime}~${notify.endTime}\n${notify.addrRoad}`)
  }, '')
}

/**
 * Generate the description of card of carousel message on roadWork type
 * @param {Array} notifications - notifications in same roadWork type
 * @return {String}
 */
function roadWorkContent(notifications) {
  return notifications.reduce((output, notify) => {
    if (output) output += '\n'
    const timeContent = notify.startTime && notify.endTime
      ? `${notify.startTime}~${notify.endTime}`
      : '依交通管制時間施工'
    return (output += `${notify.startDate.slice(5)}~${notify.endDate.slice(5)} ${timeContent}\n${notify.addrRoad}`)
  }, '')
}

/**
 * Generate the altText of the carousel message
 * @param {Object} notificationsByTypes - notifications with different types as its attribute
 * @return {String}
 */
function altTextTemplate(notificationsByTypes) {
  const typeCounts =
    (notificationsByTypes['water_outage'] ? 1 : 0) +
    (notificationsByTypes['power_outage'] ? 1 : 0) +
    (notificationsByTypes['road_work'] ? 1 : 0)

  const waterOutageCount = notificationsByTypes['water_outage']
    ? notificationsByTypes['water_outage'].length
    : 0
  const powerOutageCount = notificationsByTypes['power_outage']
    ? notificationsByTypes['power_outage'].length
    : 0
  const roadWorkCount = notificationsByTypes['road_work']
    ? notificationsByTypes['road_work'].length
    : 0

  const waterOutageNotify = waterOutageCount > 0
    ? `${waterOutageCount} 則 <停水通知>`
    : ''
  const powerOutageNotify = powerOutageCount > 0
    ? `${waterOutageNotify ? '，' : ''}${powerOutageCount} 則 <停電通知>`
    : ''
  const roadWorkNotify = roadWorkCount > 0
    ? `${waterOutageNotify || powerOutageNotify ? '，' : ''}${roadWorkCount} 則 <修路通知>`
    : ''

  const totalCounts = waterOutageCount + powerOutageCount + roadWorkCount
  const totalNotifyText = typeCounts > 1 ? `，共 ${totalCounts} 則公告訊息` : ''

  return `生活 Chat 寶：您明天有 ${waterOutageNotify}${powerOutageNotify}${roadWorkNotify}${totalNotifyText}。`
}

/**
 * Return the thumbnail image URL for different type of notifications
 * @param {String} type - type of the notification
 * @return {String}
 */
function thumbnailFactory(type) {
  switch (type) {
    case 'water_outage':
      return 'https://glacial-falls-53180.herokuapp.com/img/water_outage.jpg'
    case 'power_outage':
      return 'https://glacial-falls-53180.herokuapp.com/img/power_outage.jpg'
    case 'road_work':
      return 'https://glacial-falls-53180.herokuapp.com/img/road_work.jpg'
    default:
      throw new TypeError('Unknown type of notification!')
  }
}

/**
 * Return the Chinese name of different type of notifications
 * @param {String} type - type of the notification
 * @return {String}
 */
function notificationTypeFactory(type) {
  switch (type) {
    case 'water_outage':
      return '停水'
    case 'power_outage':
      return '停電'
    case 'road_work':
      return '修路'
    default:
      throw new TypeError('Unknown type of notification!')
  }
}
