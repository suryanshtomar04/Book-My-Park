const Joi = require("joi");
const AppError = require("../utils/AppError");

/**
 * @desc A reusable middleware function to validate request data against a Joi schema
 * @param {Joi.ObjectSchema} schema - The compiled Joi schema
 * @param {String} source - e.g., 'body', 'query', or 'params' (default is 'body')
 */
const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,     // Return all errors, not just the first one
      stripUnknown: true,    // Remove object keys not defined in the schema
    });

    if (error) {
      // Map validation error details to a single string message
      const errorMessage = error.details.map((detail) => detail.message).join(", ");
      return next(new AppError(errorMessage, 400));
    }

    // Replace req object with validated, stripped data
    req[source] = value;
    next();
  };
};

module.exports = validate;
