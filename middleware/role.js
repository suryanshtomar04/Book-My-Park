/**
 * Generic role-checking middleware factory.
 * Usage:  router.get("/admin", protect, authorize("owner"), handler);
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized — please login first",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied — requires one of: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

// ──────────────── Convenience Shortcuts ────────────────
const onlyAdmin = authorize("admin");
const onlyUser = authorize("user");

module.exports = { authorize, onlyAdmin, onlyUser };
