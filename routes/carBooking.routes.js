const express = require("express");
const {
  handleBooking,
  handleGetBooking,
  handleGetBookingDetails,
  handlePayment,
  handleCancelBooking,
  handleGetAdminBooking,
  handleConfirmBooking,
  handleCouponCode,
} = require("../controllers/carBooking.controller");
const router = express.Router();

router
  .post("/coupon", handleCouponCode)
  .post("/:carId", handleBooking)
  .patch("/:id", handlePayment)
  .patch("/cancel/:id", handleCancelBooking)
  .patch("/confirm/:id", handleConfirmBooking);
router
  .get("/user/:status", handleGetBooking)
  .get("/admin", handleGetAdminBooking)
  .get("/:id", handleGetBookingDetails);
module.exports = { bookingRoute: router };
