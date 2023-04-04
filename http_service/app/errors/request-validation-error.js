const { CustomError } = require('./custom-error');

class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor() {
    super('Invalid request parameter');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return { message: 'Invalid request parameter', success: false };
  }
}

module.exports = { RequestValidationError };
