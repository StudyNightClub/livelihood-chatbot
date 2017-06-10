/**
 * The finite state machine for managing user onboarding state
 */
class OnboardStateManagement {
  /**
   * Initialize the stateManagement with Map
   */
  constructor() {
    this.stateManagement = new Map()

    this.fire = this.fire.bind(this)
    this.getUserState = this.getUserState.bind(this)

    this._transit = this._transit.bind(this)
  }

  /**
   * Fire a event on user and return the new state
   * @param {String} userId - the userId describing the user
   * @param {*} event - the event user has trigged
   * @return {String} - new transitioned state of the user
   */
  fire(userId, event) {
    const newState = this._transit(userId, event)
    if (newState) {
      this.stateManagement.set(userId, newState)
    } else {
      this.stateManagement.delete(userId)
    }
    return newState
  }

  /**
   * Return the current state of the user
   * @param {String} userId - the userId describing the user
   * @return {String|Undefined} - the current state of the user
   */
  getUserState(userId) {
    return this.stateManagement.get(userId)
  }

  /**
   * Transition the current state of user with the event
   * @param {String} userId - the userId describing the user
   * @param {String} event - the event user has trigged
   * @return {String|Undefined} - the new state ot the user
   */
  _transit(userId, event) {
    const state = this.stateManagement.get(userId) || 'none'
    switch (state) {
      case 'none':
        return none(event)
      case 'incoming':
        return incoming(event)
      case 'engaging':
        return engaging(event)
      case 'engaged':
        return engaged(event)
      default:
        throw new TypeError('Unknown type of event!')
    }

    /**
     * Definition of transition from none state
     * @param {String} action - the event name
     * @return {String|Undefined} - next state of the transition
     */
    function none(action) {
      switch (action) {
        case 'followedMe':
          return 'incoming'
        default:
          return null
      }
    }
    /**
     * Definition of transition from incoming state
     * @param {String} action - the event name
     * @return {String|Undefined} - next state of the transition
     */
    function incoming(action) {
      switch (action) {
        case 'sharedLocation':
          return 'engaging'
        default:
          return 'incoming'
      }
    }
    /**
     * Definition of transition from engaging state
     * @param {String} action - the event name
     * @return {String|Undefined} - next state of the transition
     */
    function engaging(action) {
      switch (action) {
        case 'receivedNotification':
          return 'engaged'
        default:
          return 'engaging'
      }
    }
    /**
     * Definition of transition from engaged state
     * @param {String} action - the event name
     * @return {String|Undefined} - next state of the transition
     */
    function engaged(action) {
      switch (action) {
        case 'doneSetting':
          return null
        default:
          return 'engaged'
      }
    }
  }
}
module.exports = OnboardStateManagement
