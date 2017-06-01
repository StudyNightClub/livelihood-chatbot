const LINEClient = require('../service/LINE/client')
const lineCarouselTemplate = require('../service/LINE/utils')
  .carouselMessageFormatter

module.exports = () => {
  return async (ctx, next) => {
    const lineClient = new LINEClient(ctx.config)
    ctx.request.events.forEach(e => {
      lineClient.pushMessage(
        e.target,
        lineCarouselTemplate(e.altText, e.columns)
      )
    })
  }
}
