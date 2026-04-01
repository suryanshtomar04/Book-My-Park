const catchAsync = require("../utils/catchAsync");
const parkingService = require("../services/parkingService");
const { uploadMultiple } = require("../services/cloudinaryService");
const AppError = require("../utils/AppError");

const safeParse = (value) => {
  if (typeof value === "string") {
    try { return JSON.parse(value); } catch { return value; }
  }
  return value;
};

/**
 * @desc    Create a new parking spot
 * @route   POST /api/parking
 * @access  Private — owner
 */
const createParking = catchAsync(async (req, res, next) => {
  const locationRaw = safeParse(req.body.location);
  const availability = safeParse(req.body.availability);
  const { pricePerHour, description, title, totalSlots, availableSlots } = req.body;

  // Normalize location to GeoJSON format expected by Mongoose 2dsphere index
  let location = locationRaw;
  if (locationRaw) {
    const coords = locationRaw.coordinates;
    let geoCoords;
    if (coords && typeof coords === 'object' && !Array.isArray(coords)) {
      // Frontend sends { lat, lng } — convert to GeoJSON [lng, lat]
      geoCoords = [parseFloat(coords.lng), parseFloat(coords.lat)];
    } else if (Array.isArray(coords)) {
      geoCoords = coords.map(Number);
    }
    location = {
      type: 'Point',
      coordinates: geoCoords,
      address: locationRaw.address || '',
    };
  }

  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    const buffers = req.files.map((f) => f.buffer);
    const results = await uploadMultiple(buffers);
    imageUrls = results.map((r) => r.url);
  }

  const parkingData = { 
    location, 
    availability, 
    pricePerHour, 
    description, 
    title, 
    totalSlots,
    availableSlots: availableSlots || totalSlots
  };
  const parking = await parkingService.createParking(req.user._id, parkingData, imageUrls);

  res.status(201).json({
    success: true,
    message: "Parking spot created successfully",
    data: parking,
  });
});

/**
 * @desc    Get all parking spots
 * @route   GET /api/parking
 * @access  Public
 */
const getAllParkings = catchAsync(async (req, res, next) => {
  const { lng, lat, radius, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (lng && lat) {
    const maxDistance = (parseFloat(radius) || 5) * 1000;
    filter.location = {
      $near: {
        $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: maxDistance,
      },
    };
  }

  if (minPrice || maxPrice) {
    filter.pricePerHour = {};
    if (minPrice) filter.pricePerHour.$gte = parseFloat(minPrice);
    if (maxPrice) filter.pricePerHour.$lte = parseFloat(maxPrice);
  }

  const parsedLimit = parseInt(limit);
  const skip = (parseInt(page) - 1) * parsedLimit;

  const { parkings, total } = await parkingService.getAllParkings(filter, skip, parsedLimit);

  res.status(200).json({
    success: true,
    count: parkings.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parsedLimit),
    data: parkings,
  });
});

/**
 * @desc    Get nearby parkings via geoNear
 * @route   GET /api/parking/nearby
 * @access  Public
 */
const getNearbyParkings = catchAsync(async (req, res, next) => {
  const { lat, lng, radius, limit } = req.query;
  if (!lat || !lng) throw new AppError("lat and lng query parameters are required", 400);

  const maxDistance = (parseFloat(radius) || 5) * 1000;
  const maxResults = parseInt(limit) || 20;

  const parkings = await parkingService.getNearbyParkings(
    parseFloat(lng),
    parseFloat(lat),
    maxDistance,
    maxResults
  );

  res.status(200).json({
    success: true,
    count: parkings.length,
    data: parkings,
  });
});

/**
 * @desc    Get a single parking spot by ID
 * @route   GET /api/parking/:id
 * @access  Public
 */
const getParkingById = catchAsync(async (req, res, next) => {
  const parking = await parkingService.getParkingById(req.params.id);

  res.status(200).json({
    success: true,
    data: parking,
  });
});

/**
 * @desc    Delete a parking spot
 * @route   DELETE /api/parking/:id
 * @access  Private — owner
 */
const deleteParking = catchAsync(async (req, res, next) => {
  await parkingService.deleteParking(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    message: "Parking spot deleted successfully",
    data: null
  });
});

module.exports = { createParking, getAllParkings, getNearbyParkings, getParkingById, deleteParking };
