module.exports = () => {
  return async (ctx, next) => {
    const incomingEvents = ctx.state.incomingEvents
    const client = ctx.clients.Livelihood

    incomingEvents.forEach((res, event) => {
      if (event.type !== 'message') return

      const message = event.message
      if (message.type === 'location') {
        const locationDist = locationFilter(message.address)
        if (locationDist) {
          client.get(
            `/notification?address=${locationDist}&latitude=${message.longitude}&longitude=${message.longitude}`
          )
          ctx.store.onboard.set(event.source.userId, 'engaged')
        }
      } else if (message.type === 'text') {
        // TODO: handle sharing location with text
      }
    })

    await next()
  }
}

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
