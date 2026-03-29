const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner ID is required"],
      index: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, "Coordinates are required"],
        validate: {
          validator(coords) {
            return (
              coords.length === 2 &&
              coords[0] >= -180 && coords[0] <= 180 && // lng
              coords[1] >= -90 && coords[1] <= 90      // lat
            );
          },
          message: "Coordinates must be [longitude, latitude] within valid ranges",
        },
      },
      address: {
        type: String,
        trim: true,
      },
    },

    pricePerHour: {
      type: Number,
      required: [true, "Price per hour is required"],
      min: [0, "Price cannot be negative"],
    },

    availability: {
      startTime: {
        type: String, // e.g. "08:00"
        required: [true, "Start time is required"],
      },
      endTime: {
        type: String, // e.g. "22:00"
        required: [true, "End time is required"],
      },
    },

    images: {
      type: [String], // array of image URLs
      default: [],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be below 0"],
      max: [5, "Rating cannot exceed 5"],
    },
  },
  {
    timestamps: true,
  }
);

// ──────────────── Indexes ────────────────
parkingSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Parking", parkingSchema);
