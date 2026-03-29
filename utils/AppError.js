/**
 * @desc Custom Error class to standardize operational errors
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // Status is "fail" for 4xx errors, "error" for 5xx errors
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // Flag to easily distinguish operational errors vs programming/system errors
    this.isOperational = true;

    // Capture the stack trace but exclude the constructor call itself
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
