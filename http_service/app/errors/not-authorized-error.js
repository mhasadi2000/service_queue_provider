const { CustomError } = require('./custom-error');

class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not Authorized');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return {
      data: null,
      message: 'Authentication Token is missing!',
      success: false,
    };
  }
}

module.exports = { NotAuthorizedError };
