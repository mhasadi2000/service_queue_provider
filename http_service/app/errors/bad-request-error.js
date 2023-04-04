const { CustomError } = require('./custom-error');

class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(message) {
    super('Bad Request');
    this.message = message;

    // Only because we extends a built in error
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return { message: this.message , success: false };
  }
}

module.exports = { BadRequestError };
