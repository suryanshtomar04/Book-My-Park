const express = require("express");
const protect = require("../middleware/auth");
const { onlyDriver } = require("../middleware/role");
const validate = require("../middleware/validate");
const { mockPaymentSchema } = require("../validations");
const { mockPayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/mock", protect, onlyDriver, validate(mockPaymentSchema), mockPayment);

module.exports = router;
