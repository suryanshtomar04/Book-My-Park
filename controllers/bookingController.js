const catchAsync = require("../utils/catchAsync");
const bookingService = require("../services/bookingService");
const Booking = require("../models/Booking");
const Parking = require("../models/Parking");

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

/**
 * @desc    End an active booking
 * @route   PUT /api/booking/:id/end
 * @access  Private — booking owner
 */
const endBooking = async (req, res) => {
  try {
    console.log("Ending booking:", req.params.id);
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // prevent double ending
    if (booking.status === "completed") {
      return res.status(400).json({ message: "Already ended" });
    }

    booking.status = "completed";
    await booking.save();

    // update parking slots
    const parking = await Parking.findById(booking.parkingId);

    if (parking) {
      parking.availableSlots += 1;

      if (parking.availableSlots > parking.totalSlots) {
        parking.availableSlots = parking.totalSlots;
      }

      await parking.save();
    }

    res.json({ message: "Booking ended successfully" });

  } catch (error) {
    console.error("End booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createBooking, getMyBookings, getUserBookings, getOwnerBookings, cancelBooking, endBooking };
