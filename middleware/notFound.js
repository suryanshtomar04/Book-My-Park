const AppError = require("../utils/AppError");

/**
 * 404 catch-all middleware.
 * Must be registered AFTER all routes but BEFORE the error handler.
 */
const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

module.exports = notFound;
