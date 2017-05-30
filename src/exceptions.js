/** Utilize to create the customized error */
class ExtendableError extends Error {
  /**
   * @constructor
   * @param {String} msg - The message of the error 
   */
  constructor(msg) {
    super(msg)
    this.name = this.constructor.name
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = new Error(msg).stack
    }
  }
}

/** Represent the error of signature validation failed */
class SignatureValidationFailed extends ExtendableError {
  /**
   * @constructor
   * @param {String} msg - The message of the error.
   * @param {String} signature - The failed signature causing the error.
   */
  constructor(msg, signature) {
    super(msg)
    this.signature = signature
    this.status = 403
  }
}
module.exports.SignatureValidationFailed = SignatureValidationFailed
