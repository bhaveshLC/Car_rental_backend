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
  .patch("/admin/cancel/:id", handleCancelBooking)
  .patch("/admin/confirm/:id", handleConfirmBooking)
  .patch("/confirm/:id", handleConfirmBooking);
router
  .get("/user/:status", handleGetBooking)
  .get("/admin", handleGetAdminBooking)
  .get("/admin/:id", handleGetBookingDetails)
  .get("/:id", handleGetBookingDetails);
module.exports = { bookingRoute: router };
