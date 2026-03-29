const catchAsync = require("../utils/catchAsync");
const authService = require("../services/authService");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = catchAsync(async (req, res, next) => {
  const { user, token } = await authService.signupUser(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: { user, token },
  });
});

/**
 * @desc    Login an existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = catchAsync(async (req, res, next) => {
  const { user, token } = await authService.loginUser(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { user, token },
  });
});

module.exports = { signup, login };
