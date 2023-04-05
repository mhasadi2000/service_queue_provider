const { CustomError } = require('./custom-error');

class ForbiddenError extends CustomError {
  statusCode = 403;

  constructor(message = 'Forbidden request') {
    super('Forbidden');
    this.message = message;

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors() {
    return { message: this.message, success: false };
  }
}

module.exports = { ForbiddenError };
