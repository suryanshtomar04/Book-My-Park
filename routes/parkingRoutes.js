const express = require("express");
const protect = require("../middleware/auth");
const { onlyOwner } = require("../middleware/role");
const upload = require("../middleware/upload");
const validate = require("../middleware/validate");
const { createParkingSchema } = require("../validations");

const {
  createParking,
  getAllParkings,
  getNearbyParkings,
  getParkingById,
  deleteParking,
} = require("../controllers/parkingController");

const router = express.Router();

router.route("/")
  .post(protect, onlyOwner, upload.array("images", 5), validate(createParkingSchema), createParking)
  .get(getAllParkings);

// ⚠️  Must be BEFORE /:id so Express doesn't match "nearby" as an ID
router.get("/nearby", getNearbyParkings);

router.route("/:id")
  .get(getParkingById)
  .delete(protect, onlyOwner, deleteParking);

module.exports = router;
