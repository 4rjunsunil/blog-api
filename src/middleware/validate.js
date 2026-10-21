const HttpError = require('../utils/httpError');

function validate(validator) {
  return function validateRequest(req, res, next) {
    const errors = validator(req.body);
    if (errors.length > 0) {
      return next(new HttpError(400, errors.join('; ')));
    }
    return next();
  };
}

module.exports = validate;
