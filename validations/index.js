const Joi = require("joi");

// ──────────────── Auth Validations ────────────────
const signupSchema = Joi.object({
  name: Joi.string().trim().max(50).required().messages({
    "string.empty": "Name is required",
    "string.max": "Name cannot exceed 50 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().trim().email().lowercase().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
  role: Joi.string().valid("driver", "owner").default("driver").messages({
    "any.only": "Role must be either 'driver' or 'owner'",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Please provide email",
    "any.required": "Please provide email",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Please provide password",
    "any.required": "Please provide password",
  }),
});

// ──────────────── Parking Validations ────────────────
// Helper to parse location if it's sent as a string (from FormData)
const parseJSON = (value, helpers) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return helpers.error("any.invalid");
    }
  }
  return value;
};

const createParkingSchema = Joi.object({
  location: Joi.custom(parseJSON).required().messages({
    "any.required": "Location is required",
    "any.invalid": "Location must be a valid JSON object",
  }),
  pricePerHour: Joi.number().min(0).required().messages({
    "number.min": "Price cannot be negative",
    "any.required": "Price per hour is required",
  }),
  availability: Joi.custom(parseJSON).required().messages({
    "any.required": "Availability is required",
    "any.invalid": "Availability must be a valid JSON object",
  }),
  description: Joi.string().allow("", null).trim().max(500).messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
});

// ──────────────── Booking Validations ────────────────
const createBookingSchema = Joi.object({
  parkingId: Joi.string().hex().length(24).required().messages({
    "string.pattern.base": "Invalid parking ID format",
    "any.required": "parkingId is required",
    "string.length": "Invalid parking ID length",
    "string.hex": "Invalid parking ID format",
  }),
  startTime: Joi.date().iso().required().messages({
    "date.format": "startTime must be a valid ISO date",
    "any.required": "startTime is required",
  }),
  endTime: Joi.date().iso().greater(Joi.ref("startTime")).required().messages({
    "date.greater": "endTime must be after startTime",
    "any.required": "endTime is required",
  }),
});

const mockPaymentSchema = Joi.object({
  bookingId: Joi.string().hex().length(24).required().messages({
    "string.pattern.base": "Invalid booking ID format",
    "any.required": "bookingId is required",
    "string.length": "Invalid booking ID length",
    "string.hex": "Invalid booking ID format",
  }),
});

module.exports = {
  signupSchema,
  loginSchema,
  createParkingSchema,
  createBookingSchema,
  mockPaymentSchema,
};
