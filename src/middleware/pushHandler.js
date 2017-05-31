const LINEClient = require('../service/LINE/client')

module.exports = () => {
  return async (ctx, next) => {
    const lineClient = new LINEClient(ctx.config)
    ctx.request.events.forEach(e => {
      lineClient.pushMessage(e.target, {
        type: 'text',
        text: e.text
      })
    })
  }
}
