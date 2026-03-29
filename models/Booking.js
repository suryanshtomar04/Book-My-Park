const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },

    parkingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parking",
      required: [true, "Parking ID is required"],
      index: true,
    },

    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },

    endTime: {
      type: Date,
      required: [true, "End time is required"],
      validate: {
        validator(value) {
          return value > this.startTime;
        },
        message: "End time must be after start time",
      },
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "booked", "cancelled"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },

    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },

    // ──────────────── Razorpay Payment Fields ────────────────
    razorpayOrderId: {
      type: String,
      default: null,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
  },
  {
    timestamps: true,
  }
);

// ──────────────── Indexes ────────────────
// Fast lookups for "all bookings for a parking spot in a time range"
bookingSchema.index({ parkingId: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
