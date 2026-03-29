const Parking = require("../models/Parking");
const AppError = require("../utils/AppError");

/**
 * Create a new parking spot
 */
const createParking = async (ownerId, parkingData, imageUrls) => {
  return await Parking.create({
    ownerId,
    ...parkingData,
    images: imageUrls,
  });
};

/**
 * Get all parking spots with optional geo and price filters
 */
const getAllParkings = async (filters, skip, limit) => {
  const [parkings, total] = await Promise.all([
    Parking.find(filters)
      .populate("ownerId", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Parking.countDocuments(filters),
  ]);
  return { parkings, total };
};

/**
 * Get parking spots near a location, sorted by distance
 */
const getNearbyParkings = async (lng, lat, maxDistance, maxResults) => {
  return await Parking.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng, lat],
        },
        distanceField: "distance",
        maxDistance: maxDistance,
        spherical: true,
      },
    },
    { $limit: maxResults },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { name: 1, email: 1 } }],
      },
    },
    { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        distanceKm: { $round: [{ $divide: ["$distance", 1000] }, 2] },
      },
    },
    { $project: { __v: 0 } },
  ]);
};

/**
 * Get single parking spot by ID
 */
const getParkingById = async (id) => {
  const parking = await Parking.findById(id).populate("ownerId", "name email");
  if (!parking) throw new AppError("Parking spot not found", 404);
  return parking;
};

/**
 * Delete a parking spot, enforcing ownership
 */
const deleteParking = async (id, ownerId) => {
  const parking = await Parking.findById(id);
  if (!parking) throw new AppError("Parking spot not found", 404);

  if (parking.ownerId.toString() !== ownerId.toString()) {
    throw new AppError("Access denied — you can only delete your own spots", 403);
  }

  await parking.deleteOne();
};

module.exports = {
  createParking,
  getAllParkings,
  getNearbyParkings,
  getParkingById,
  deleteParking,
};
