const Booking = require("../models/Booking");
const AppError = require("../utils/AppError");

const handlePayment = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) throw new AppError("Booking not found", 404);
  if (booking.userId.toString() !== userId.toString()) {
    throw new AppError("Access denied — you can only pay for your own bookings", 403);
  }
  if (booking.status === "cancelled") {
    throw new AppError("Cannot pay for a cancelled booking", 400);
  }
  if (booking.paymentStatus === "paid") {
    throw new AppError("Booking is already paid", 400);
  }

  booking.status = "booked";
  booking.paymentStatus = "paid";
  await booking.save();

  await booking.populate([
    { path: "parkingId", select: "location pricePerHour description" },
    { path: "userId", select: "name email" },
  ]);

  return booking;
};

module.exports = { handlePayment };
