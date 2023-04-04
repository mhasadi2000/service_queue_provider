const { CustomError } = require('./custom-error');

class UploadFailedError extends CustomError {
  statusCode = 422;

  constructor(message) {
    super('Upload failed');
    this.message = message;

    Object.setPrototypeOf(this, UploadFailedError.prototype);
  }

  serializeErrors() {
    return { message: this.message , success: false };
  }
}

module.exports = { UploadFailedError };
