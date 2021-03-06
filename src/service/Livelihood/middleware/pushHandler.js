const lineCarouselTemplate = require('../../LINE/utils')
  .carouselMessageFormatter
const MessageFormatError = require('../../../exceptions').MessageFormatError
const emoji = require('node-emoji')

module.exports = () => {
  return async (ctx, next) => {
    const lineClient = ctx.clients.LINE
    const rawNotification = ctx.state.incomingEvent

    isRawNotificationValid(rawNotification)

    const pushNotifications = notificationFactory(rawNotification)
    try {
      let serviceResponse
      if (pushNotifications.altText) {
        serviceResponse = await lineClient.pushMessage(rawNotification.userId, [
          { type: 'text', text: pushNotifications.altText },
          pushNotifications
        ])
      } else {
        serviceResponse = await lineClient.pushMessage(
          rawNotification.userId,
          pushNotifications
        )
      }
      ctx.state.serviceResponses = [serviceResponse]

      if (
        ctx.store.onboard.getUserState(
          rawNotification.userId,
          'receivedNotification'
        ) === 'engaging'
      ) {
        ctx.store.onboard.fire(rawNotification.userId, 'receivedNotification')
        if (pushNotifications.altText) {
          serviceResponse = await lineClient.pushMessage(
            rawNotification.userId,
            [
              {
                type: 'text',
                text: emoji.emojify(
                  '嗯！我是生活 Chat 寶:blush:\n幫助您搶先知道未來停水、停電、以及道路搶修的時間！'
                )
              },
              {
                type: 'text',
                text: emoji.emojify(
                  '現在就點選左下方按鈕 -> 開啟預報及設定-> 進入個人化設定。\n完成後就可以收到特別為你設計的民生停水、停電預報通知喔。（還有你家馬路外面施工的預報通知喔！）:point_down:'
                )
              }
            ]
          )
        } else {
          serviceResponse = await lineClient.pushMessage(
            rawNotification.userId,
            [
              {
                type: 'text',
                text: emoji.emojify(
                  '不過沒關係，我是生活 Chat 寶:blush:\n幫助您搶先知道未來停水、停電、以及道路搶修的時間！'
                )
              },
              {
                type: 'text',
                text: emoji.emojify(
                  '現在就點選左下方按鈕 -> 開啟預報及設定-> 進入個人化設定。\n完成後就可以收到特別為你設計的民生停水、停電預報通知喔。（還有你家馬路外面施工的預報通知喔！）:point_down:'
                )
              }
            ]
          )
        }
      }

      ctx.state.serviceResponses = [
        ...ctx.state.serviceResponses,
        serviceResponse
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
    (!rawNotification.notifications ||
      rawNotification.notifications.length <= 0) &&
    rawNotification.category !== 'userRequested'
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
      if (
        !rawNotification.notifications ||
        rawNotification.notifications.length === 0
      ) {
        return noNotificationsMessage()
      } else {
        return userRequestedFormMessageOneTypeOneNotify(rawNotification)
      }
    case 'userScheduled':
    case 'systemScheduled':
    case 'broadcast':
      return userRequestedFormMessageOneTypeOneNotify(rawNotification)
    default:
      throw new TypeError('Unknown type of notification!')
  }
}

/**
 * Generate the no notification message object
 * @return {Object}
 */
function noNotificationsMessage() {
  return {
    type: 'text',
    text: '您所選擇的地點，目前附近沒有政府預定的民生公告訊息喔！'
  }
}

/**
 * Generate the userRequested category of push notification one by one category
 * @param {Object} raw - Incoming raw data for pushing
 * @return {Object}
 */
function userRequestedFormMessageOneTypeOneNotify(raw) {
  const notificationsByTypes = {}
  raw.notifications.forEach(notification => {
    if (!notificationsByTypes[notification.type])
      notificationsByTypes[notification.type] = []
    notificationsByTypes[notification.type].push(notification)
  })
  const altText = altTextTemplate(notificationsByTypes)

  const cards = Object.keys(notificationsByTypes).map(type => {
    const notificationType = notificationTypeFactory(type)

    const notificationDetail = notificationNearestDateFactory(
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
 * @param {String} type - the type of the notification
 * @param {Array} notifications - notifications in same type
 * @return {Object}
 */
function notificationNearestDateFactory(type, notifications) {
  const nearestNotification = findNearestEndNotification(notifications)
  switch (type) {
    case 'water_outage':
    case 'power_outage':
      return waterPowerOutageContent([nearestNotification])
    case 'road_work':
      return roadWorkContent([nearestNotification])
    default:
      throw new TypeError('Unknown type of notification!')
  }
}

/**
 * Find the nearest date time notification compared with now 
 * @param {Array} notifications - notifications in same type
 * @return {Object}
 */
function findNearestEndNotification(notifications) {
  const notifyEndMilliseconds = notifications.map(notification => {
    if (notification.endTime)
      return Date.parse(`${notification.endDate} ${notification.endTime}`)
    else return Date.parse(`${notification.endDate}`)
  })
  return notifications[
    notifyEndMilliseconds.indexOf(Math.min(...notifyEndMilliseconds))
  ]
}

/**
 * Generate the userRequested category of push notification
 * @param {Object} raw - Incoming raw data for pushing
 * @return {Object}
 */
// function userRequestedFormMessage(raw) {
//   const notificationsByTypes = {}
//   raw.notifications.forEach(notification => {
//     if (!notificationsByTypes[notification.type])
//       notificationsByTypes[notification.type] = []
//     notificationsByTypes[notification.type].push(notification)
//   })
//   const altText = altTextTemplate(notificationsByTypes)
//   const cards = Object.keys(notificationsByTypes).map(type => {
//     const notificationType = notificationTypeFactory(type)
//     const notificationDetail = notificationDetailFactory(
//       type,
//       notificationsByTypes[type]
//     )
//     return {
//       thumbnailImageUrl: thumbnailFactory(type),
//       title: `明天要${notificationType}`,
//       text: notificationDetail.length >= 60
//         ? notificationDetail.slice(0, 60)
//         : notificationDetail,
//       actions: [
//         {
//           type: 'uri',
//           label: `看看${notificationType}範圍`,
//           uri: raw.mapURL[type]
//         }
//       ]
//     }
//   })
//   return lineCarouselTemplate(altText, cards)
// }

/**
 * Generate the description of card of carousel message depending on type of the notification
 * @param {String} type - type of the notification
 * @param {Object} notifications - notifications in same types
 * @return {String}
 */
// function notificationDetailFactory(type, notifications) {
//   switch (type) {
//     case 'water_outage':
//     case 'power_outage':
//       return waterPowerOutageContent(notifications)
//     case 'road_work':
//       return roadWorkContent(notifications)
//     default:
//       throw new TypeError('Unknown type of notification!')
//   }
// }

/**
 * Generate the description of card of carousel message on waterOutage and powerOutage type
 * @param {Array} notifications - notifications in same waterOutage and powerOutage type
 * @return {String}
 */
function waterPowerOutageContent(notifications) {
  return notifications.reduce((output, notify) => {
    if (output) output += '\n'
    const startChineseYear = convertToChineseYear(
      parseInt(notify.startDate.slice(0, 4), 10)
    )
    const endChineseYear = convertToChineseYear(
      parseInt(notify.endDate.slice(0, 4), 10)
    )
    return (output += `${startChineseYear}/${notify.startDate.slice(5)} ～ ${endChineseYear}/${notify.endDate.slice(5)}\n${notify.startTime} ～ ${notify.endTime}\n${notify.addrRoad}`)
  }, '')
}

/**
 * Convert the year format to chinese year format
 * @param {Number} year - the number of the year
 * @return {Number}
 */
function convertToChineseYear(year) {
  return year - 1911
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
      ? `${notify.startTime} ~ ${notify.endTime}`
      : '依交通管制時間施工'
    const startChineseYear = convertToChineseYear(
      parseInt(notify.startDate.slice(0, 4), 10)
    )
    const endChineseYear = convertToChineseYear(
      parseInt(notify.endDate.slice(0, 4), 10)
    )
    return (output += `${startChineseYear}/${notify.startDate.slice(5)} ～ ${endChineseYear}/${notify.endDate.slice(5)}\n${timeContent}\n${notify.addrRoad}`)
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
  const totalNotifyText = typeCounts > 1 ? `，共 ${totalCounts} 則通知` : ''

  return `您明天有 ${waterOutageNotify}${powerOutageNotify}${roadWorkNotify}${totalNotifyText}。快來查看內容，好提早準備喔！`
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
      return '道路施工'
    default:
      throw new TypeError('Unknown type of notification!')
  }
}
