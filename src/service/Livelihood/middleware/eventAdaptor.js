module.exports = () => {
  return async (ctx, next) => {
    ctx.state.incomingEvents =
      ctx.request.fields.events || ctx.request.body.events
    ctx.state.outgoingEvents = []
    await next()
  }
}
