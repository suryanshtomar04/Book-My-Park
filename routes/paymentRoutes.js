const express = require("express");
const protect = require("../middleware/auth");
const { onlyUser } = require("../middleware/role");
const validate = require("../middleware/validate");
const { mockPaymentSchema } = require("../validations");
const { mockPayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/mock", protect, onlyUser, validate(mockPaymentSchema), mockPayment);

module.exports = router;
