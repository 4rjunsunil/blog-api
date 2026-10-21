function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.name === 'ValidationError' || error.name === 'CastError' || error.name === 'BSONError') {
    return res.status(400).json({ error: error.message });
  }
  if (error.code === 11000) {
    return res.status(409).json({ error: 'A record with that value already exists' });
  }
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body contains invalid JSON' });
  }

  const status = Number.isInteger(error.status) ? error.status : 500;
  const message = status === 500 ? 'An unexpected server error occurred' : error.message;
  if (status === 500) {
    console.error(error);
  }
  return res.status(status).json({ error: message });
}

module.exports = errorHandler;
