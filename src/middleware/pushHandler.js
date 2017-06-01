const LINEClient = require('../service/LINE/client')
const lineCarouselTemplate = require('../service/LINE/utils')
  .carouselMessageFormatter

module.exports = () => {
  return async (ctx, next) => {
    const lineClient = new LINEClient(ctx.config)
    ctx.request.events.forEach(e => {
      lineClient.pushMessage(
        e.target,
        lineCarouselTemplate('this is a carousel template', [
          {
            thumbnailImageUrl: 'https://www.taiwanhot.net/wp-content/uploads/2016/10/5809d5c14f272.jpg',
            title: '停水',
            text: '不不不不不',
            actions: [
              {
                type: 'uri',
                label: '看細節',
                uri: 'http://lorempixel.com/604/400/'
              }
            ]
          },
          {
            thumbnailImageUrl: 'https://pbs.twimg.com/media/DAmt7JwXkAEiam5.jpg',
            title: '停電',
            text: '啊啊啊啊啊',
            actions: [
              {
                type: 'uri',
                label: '看細節',
                uri: 'http://lorempixel.com/604/400/'
              }
            ]
          },
          {
            thumbnailImageUrl: 'https://p1-news.hfcdn.com/p1-news/ODYzMzUybmV3cw,,/a7b5459837344805.jpg',
            title: '修路',
            text: '嗚哇哇哇哇',
            actions: [
              {
                type: 'uri',
                label: '看細節',
                uri: 'http://lorempixel.com/604/400/'
              }
            ]
          }
        ])
      )
    })
  }
}
