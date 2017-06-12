/**
 * Generate the template of carousel message for introducing share location button
 * @return {Array} - content of the carousel message
 */
function shareLocationCarouselMessage() {
  return [
    {
      thumbnailImageUrl: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-keyboardButton.png',
      text: '先點選左下方的鍵盤按鈕',
      actions: [
        {
          type: 'uri',
          label: '看大圖',
          uri: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-keyboardButton.png'
        }
      ]
    },
    {
      thumbnailImageUrl: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-plusButton.png',
      text: '再按一下＋按鈕，打開進階訊息選單',
      actions: [
        {
          type: 'uri',
          label: '看大圖',
          uri: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-plusButton.png'
        }
      ]
    },
    {
      thumbnailImageUrl: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-shareLocation.png',
      text: '找到分享位置訊息按鈕',
      actions: [
        {
          type: 'uri',
          label: '看大圖',
          uri: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-shareLocation.png'
        }
      ]
    },
    {
      thumbnailImageUrl: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-yourLocation.png',
      text: '最後請隨意分享一個位置，看看政府正準備做什麼事情',
      actions: [
        {
          type: 'uri',
          label: '看大圖',
          uri: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-yourLocation.png'
        }
      ]
    }
  ]
}
module.exports.shareLocationCarouselMessage = shareLocationCarouselMessage

/**
 * Generate the template of carousel message for demo of push notification in onboarding process
 * @param {Object} info - the object containing the notification info
 * @return {Object} - content of the carousel message
 */
function onboardingPushNotification(info) {
  return {
    type: 'carousel',
    altText: '嗨嗨，這是測試',
    cards: [
      {
        thumbnailImageUrl: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-keyboardButton.png',
        text: 'onboarding',
        actions: [
          {
            type: 'uri',
            label: '看大圖',
            uri: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-keyboardButton.png'
          }
        ]
      },
      {
        thumbnailImageUrl: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-plusButton.png',
        text: 'onboarding',
        actions: [
          {
            type: 'uri',
            label: '看大圖',
            uri: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-plusButton.png'
          }
        ]
      },
      {
        thumbnailImageUrl: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-shareLocation.png',
        text: 'onboarding',
        actions: [
          {
            type: 'uri',
            label: '看大圖',
            uri: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-shareLocation.png'
          }
        ]
      },
      {
        thumbnailImageUrl: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-yourLocation.png',
        text: 'onboarding',
        actions: [
          {
            type: 'uri',
            label: '看大圖',
            uri: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-yourLocation.png'
          }
        ]
      }
    ]
  }
}
module.exports.onboardingPushNotification = onboardingPushNotification

/**
 * Generate the template of carousel message for user requested notification
 * @param {Object} info - the object containing the notification info
 * @return {Object} - content of the carousel message
 */
function userRequestedNotification(info) {
  return {
    type: 'carousel',
    altText: '喔喔喔！你得到它了',
    cards: [
      {
        thumbnailImageUrl: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-keyboardButton.png',
        text: 'userRequested',
        actions: [
          {
            type: 'uri',
            label: '看大圖',
            uri: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-keyboardButton.png'
          }
        ]
      },
      {
        thumbnailImageUrl: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-plusButton.png',
        text: 'userRequested',
        actions: [
          {
            type: 'uri',
            label: '看大圖',
            uri: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-plusButton.png'
          }
        ]
      },
      {
        thumbnailImageUrl: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-shareLocation.png',
        text: 'userRequested',
        actions: [
          {
            type: 'uri',
            label: '看大圖',
            uri: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-shareLocation.png'
          }
        ]
      },
      {
        thumbnailImageUrl: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-yourLocation.png',
        text: 'userRequested',
        actions: [
          {
            type: 'uri',
            label: '看大圖',
            uri: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-yourLocation.png'
          }
        ]
      }
    ]
  }
}
module.exports.userRequestedNotification = userRequestedNotification

/**
 * Generate the template of button message for setting
 * @param {String} settingURL - the URL for setting page
 * @return {Object}
 */
function settingButtonMessage(settingURL) {
  return {
    type: 'button',
    altText: '前往個人設定頁面',
    description: '點擊下方按鈕，前往設定頁面',
    actions: [
      {
        type: 'uri',
        label: '點此前往個人設定頁面',
        uri: settingURL
      }
    ],
    thumbnailURL: 'https://glacial-falls-53180.herokuapp.com/img/setting-button.jpg'
  }
}
module.exports.settingButtonMessage = settingButtonMessage

/**
 * Generate the template of button message for map
 * @param {String} mapURL - the URL for map page
 * @return {Object}
 */
function mapButtonMessage(mapURL) {
  return {
    type: 'button',
    altText: '前往地圖預報頁面',
    description: '點擊下方按鈕，前往預報頁面',
    actions: [
      {
        type: 'uri',
        label: '點此前往地圖預報頁面',
        uri: mapURL
      }
    ],
    thumbnailURL: 'https://glacial-falls-53180.herokuapp.com/img/map-button.jpg'
  }
}
module.exports.mapButtonMessage = mapButtonMessage

/**
 * Filter the address to district resolution
 * @param {String} address - The address user shared, could be Chinese or English
 * @return {String}
 */
function locationFilter(address) {
  const chineseDistIndex = address.indexOf('區')
  if (chineseDistIndex !== -1) {
    return address.slice(3, chineseDistIndex + 1)
  } else {
    return address.match(/, ([^,]+District.+)\s\d{5}/)[1]
  }
}
module.exports.locationFilter = locationFilter
