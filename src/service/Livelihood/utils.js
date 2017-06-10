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
      text: '最後請分享隨意一個位置，看看政府正準備做什麼事情',
      actions: [
        {
          type: 'uri',
          label: '看大圖',
          uri: 'https://glacial-falls-53180.herokuapp.com/img/onboarding-shareLocation.png'
        }
      ]
    }
  ]
}
module.exports.shareLocationCarouselMessage = shareLocationCarouselMessage

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
