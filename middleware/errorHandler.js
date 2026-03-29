const AppError = require("../utils/AppError");

// Handle specific MongoDB errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : "value";
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400); // Send 409 conflict? usually 400 is fine too for bad input, 409 works. We'll use 409 for duplicate unique field
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError("Invalid token. Please log in again!", 401);
const handleJWTExpiredError = () => new AppError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      success: false,
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    // We clone the error object so we don't accidentally mutate the original error in ways we don't want
    let error = Object.create(err);
    error.name = err.name;
    error.message = err.message;

    // Handle Mongoose / Third-party specific errors
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error); // Using 400 or 409 in the handler helper
    if (error.name === "ValidationError") error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

module.exports = errorHandler;
