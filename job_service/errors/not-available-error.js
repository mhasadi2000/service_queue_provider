const { CustomError } = require("./custom-error");

class NotAvailableError extends CustomError {
  statusCode = 500;

  constructor() {
    super("Service not available");

    Object.setPrototypeOf(this, NotAvailableError.prototype);
  }

  serializeErrors() {
    return { message: "Service not available", success: false };
  }
}

module.exports = { NotAvailableError };
