const { BadRequestError } = require('./bad-request-error');
const { ForbiddenError } = require('./forbidden-error');
const { NotAuthorizedError } = require('./not-authorized-error');
const { NotAvailableError } = require('./not-available-error');
const { NotFoundError } = require('./not-found-error');
const { RequestValidationError } = require('./request-validation-error');
const { UploadFailedError } = require('./upload-failed-error');
// const { ShahkarError } = require('./shahkar-error');
// const { ShahkarValidationError } = require('./shahkar-validation-error');
const { ConflictError } = require('./conflict-error');
const { OutServerError } = require('./out-server-error');

module.exports = {
  BadRequestError,
  ForbiddenError,
  NotAuthorizedError,
  NotAvailableError,
  NotFoundError,
  RequestValidationError,
  UploadFailedError,
  // ShahkarError,
  // ShahkarValidationError,
  ConflictError,
  OutServerError,
};
