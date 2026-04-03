const Booking = require("../models/Booking");
const Parking = require("../models/Parking");
const AppError = require("../utils/AppError");

const createBooking = async (userId, parkingId, startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const parking = await Parking.findById(parkingId);
  if (!parking) throw new AppError("Parking spot not found", 404);

  const conflict = await Booking.findOne({
    parkingId,
    status: { $in: ["booked", "pending"] },
    startTime: { $lt: end },
    endTime: { $gt: start },
  });

  if (conflict) {
    throw new AppError("Parking spot is already booked for the requested time slot", 409);
  }

  const durationHours = (end - start) / (1000 * 60 * 60);
  const totalPrice = Math.round(durationHours * parking.pricePerHour * 100) / 100;

  const booking = await Booking.create({
    userId,
    parkingId,
    startTime: start,
    endTime: end,
    totalPrice,
  });

  await booking.populate([
    { path: "parkingId", select: "title location pricePerHour description images" },
    { path: "userId", select: "name email" },
  ]);

  return { booking, durationHours, pricePerHour: parking.pricePerHour, totalPrice };
};

const getMyBookings = async (userId) => {
  return await Booking.find({ userId })
    .populate("parkingId", "title location pricePerHour description images")
    .sort({ createdAt: -1 });
};

const getUserBookings = async (userId) => {
  return await Booking.find({ userId })
    .populate({
      path: "parkingId",
      select: "title location pricePerHour description images availability",
      populate: { path: "ownerId", select: "name email" },
    })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
};

const getOwnerBookings = async (ownerId) => {
  const ownerSpots = await Parking.find({ ownerId }, { _id: 1 });
  const spotIds = ownerSpots.map((s) => s._id);

  return await Booking.find({ parkingId: { $in: spotIds } })
    .populate("parkingId", "title location pricePerHour description images")
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
};

const cancelBooking = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) throw new AppError("Booking not found", 404);
  if (booking.userId.toString() !== userId.toString()) {
    throw new AppError("Access denied — you can only cancel your own bookings", 403);
  }
  if (booking.status === "cancelled") {
    throw new AppError("Booking is already cancelled", 400);
  }
  if (new Date(booking.startTime) <= new Date()) {
    throw new AppError("Cannot cancel a booking that has already started or is in the past", 400);
  }

  booking.status = "cancelled";
  await booking.save();
  return booking;
};

module.exports = {
  createBooking,
  getMyBookings,
  getUserBookings,
  getOwnerBookings,
  cancelBooking,
};
