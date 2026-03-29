/**
 * @desc Wrapper to catch async errors and pass them to Express error handler
 * @param {Function} fn - The async controller function to wrap
 * @returns {Function} Express middleware function
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    // If the promise rejects, pass the error to next()
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
