module.exports = () => {
  return async (ctx, next) => {
    ctx.state.incomingEvent = ctx.request.fields || ctx.request.body
    ctx.state.outgoingEvent = []
    await next()
  }
}
