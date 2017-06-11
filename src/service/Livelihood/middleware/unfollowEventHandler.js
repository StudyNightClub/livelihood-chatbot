module.exports = () => {
  return async (ctx, next) => {
    if (ctx.state.incomingEvents.every(e => e.type !== 'unfollow')) {
      await next()
      return
    }
    /* separate unfollow and notUnfollow events */
    const events = ctx.state.incomingEvents.reduce(
      (output, e) => {
        if (e.type === 'unfollow') output.unfollow.push(e)
        else output.notUnfollow.push(e)
        return output
      },
      { unfollow: [], notUnfollow: [] }
    )

    // wait until all unfollow events were handled
    await Promise.all(
      events.unfollow.map(async e => {
        /* ----- CURRENTLY DO NOTHING WHEN USER UNFOLLOW ----- */
        // /* post new user info to livelihood control server */
        // const livelihoodClient = ctx.clients.Livelihood
        // // TODO: handle connection error with livelihood control server
        // await livelihoodClient.delete(`/user/${e.source.userId}`)
        return Promise.resolve(e)
      })
    )

    // continuously process events if there exist other events
    if (events.notUnfollow.length > 0) {
      ctx.state.incomingEvents = events.notUnfollow
      await next()
    }
  }
}
