const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");

/**
 * Generate a signed JWT for the given user ID.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Strip password and version key from the user document.
 */
const sanitizeUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

/**
 * Register a new user
 * @param {Object} userData
 * @returns {Object} { user, token }
 */
const signupUser = async (userData) => {
  const { name, email, password, role } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  // Create user (password is hashed by the pre-save hook)
  const user = await User.create({ name, email, password, role });
  const token = generateToken(user._id);

  return { user: sanitizeUser(user), token };
};

/**
 * Login an existing user
 * @param {Object} credentials
 * @returns {Object} { user, token }
 */
const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Find user and explicitly include password
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user._id);

  return { user: sanitizeUser(user), token };
};

module.exports = { signupUser, loginUser };
