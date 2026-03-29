const catchAsync = require("../utils/catchAsync");
const paymentService = require("../services/paymentService");

/**
 * @desc    Mock a successful payment
 * @route   POST /api/payment/mock
 * @access  Private — driver
 */
const mockPayment = catchAsync(async (req, res, next) => {
  const booking = await paymentService.handlePayment(req.body.bookingId, req.user._id);

  res.status(200).json({
    success: true,
    message: "Payment successful",
    data: booking,
  });
});

module.exports = { mockPayment };
