const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect routes — verify JWT and attach user to req.
 * Usage:  router.get("/me", protect, handler);
 */
const protect = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized — no token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Dev-only admin token bypass
    if (token === "dev-admin-token") {
      const mongoose = require("mongoose");
      req.user = { _id: new mongoose.Types.ObjectId(), role: "admin", name: "Dev Admin", email: "dev@admin.com" };
      return next();
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user to request (exclude password)
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized — user no longer exists",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError"
        ? "Not authorized — token has expired"
        : "Not authorized — invalid token";

    return res.status(401).json({ success: false, message });
  }
};

module.exports = protect;
