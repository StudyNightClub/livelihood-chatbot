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
      text: '分享隨意一個位置，看看政府正準備在該地區做的事情',
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
