const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");

/**
 * @desc    Health check endpoint
 * @route   GET /api/health
 * @access  Public
 */
const getHealth = catchAsync(async (req, res, next) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.status(200).json({
    success: true,
    message: "Server is running",
    data: {
      uptime: `${Math.floor(process.uptime())}s`,
      environment: process.env.NODE_ENV,
      database: dbStatus[dbState] || "unknown",
      timestamp: new Date().toISOString(),
    },
  });
});

module.exports = { getHealth };
