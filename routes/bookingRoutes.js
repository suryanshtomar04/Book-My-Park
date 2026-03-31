const express = require("express");
const protect = require("../middleware/auth");
const { onlyUser, onlyAdmin } = require("../middleware/role");
const validate = require("../middleware/validate");
const { createBookingSchema } = require("../validations");

const {
  createBooking,
  getMyBookings,
  getUserBookings,
  getOwnerBookings,
  cancelBooking,
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", protect, onlyUser, validate(createBookingSchema), createBooking);
router.get("/my", protect, getMyBookings);
router.get("/user", protect, onlyUser, getUserBookings);
router.get("/owner", protect, onlyAdmin, getOwnerBookings);
router.patch("/:id/cancel", protect, cancelBooking);

module.exports = router;
