const { CustomError } = require('./custom-error');

class ConflictError extends CustomError {
  statusCode = 409;

  constructor(message) {
    super('Conflict');
    this.message = message;

    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  serializeErrors() {
    return { message: this.message, success: false };
  }
}

module.exports = { ConflictError };
