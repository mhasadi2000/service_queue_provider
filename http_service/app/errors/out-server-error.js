const { CustomError } = require("./custom-error");

class OutServerError extends CustomError {
  statusCode = 404;

  constructor() {
    super("Out Server Error");

    Object.setPrototypeOf(this, OutServerError.prototype);
  }

  serializeErrors() {
    return { message: "Out Server Error", success: false };
  }
}

module.exports = { OutServerError };