const catchAsync = require("../utils/catchAsync");
const bookingService = require("../services/bookingService");

/**
 * @desc    Book a parking spot
 * @route   POST /api/booking
 * @access  Private — driver
 */
const createBooking = catchAsync(async (req, res, next) => {
  const { parkingId, startTime, endTime } = req.body;
  
  const { booking, durationHours, pricePerHour, totalPrice } = 
    await bookingService.createBooking(req.user._id, parkingId, startTime, endTime);

  res.status(201).json({
    success: true,
    message: "Booking confirmed",
    data: {
      booking,
      summary: {
        durationHours: parseFloat(durationHours.toFixed(2)),
        pricePerHour,
        totalPrice,
      },
    },
  });
});

/**
 * @desc    Get quick list of bookings for the user
 * @route   GET /api/booking/my
 * @access  Private
 */
const getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await bookingService.getMyBookings(req.user._id);

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

/**
 * @desc    Get detailed bookings made by the logged-in driver
 * @route   GET /api/booking/user
 * @access  Private — driver
 */
const getUserBookings = catchAsync(async (req, res, next) => {
  const bookings = await bookingService.getUserBookings(req.user._id);

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

/**
 * @desc    Get bookings on spots owned by the logged-in owner
 * @route   GET /api/booking/owner
 * @access  Private — owner
 */
const getOwnerBookings = catchAsync(async (req, res, next) => {
  const bookings = await bookingService.getOwnerBookings(req.user._id);

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

/**
 * @desc    Cancel a booking
 * @route   PATCH /api/booking/:id/cancel
 * @access  Private — booking owner
 */
const cancelBooking = catchAsync(async (req, res, next) => {
  const booking = await bookingService.cancelBooking(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    data: booking,
  });
});

module.exports = { createBooking, getMyBookings, getUserBookings, getOwnerBookings, cancelBooking };
