module.exports = () => {
  return async (ctx, next) => {
    if (!ctx.state.incomingEvents || ctx.state.incomingEvents.length === 0) {
      ctx.status = 404
    } else {
      await next()
    }
  }
}
