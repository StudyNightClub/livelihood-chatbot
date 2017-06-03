module.exports = () => {
  return async (ctx, next) => {
    ctx.request.events = ctx.request.fields.events || ctx.request.body.events
    ctx.response.body = {}
    await next()
  }
}
