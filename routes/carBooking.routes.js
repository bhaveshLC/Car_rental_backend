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
const { authMiddleware } = require("../middleware/auth.middleware");
const { adminAuthMiddleware } = require("../middleware/adminAuth.middleware");
const router = express.Router();

router
  .post("/coupon",authMiddleware, handleCouponCode)
  .post("/:carId",authMiddleware, handleBooking)
  .patch("/:id",authMiddleware, handlePayment)
  .patch("/cancel/:id",authMiddleware, handleCancelBooking)
  .patch("/admin/cancel/:id",adminAuthMiddleware, handleCancelBooking)
  .patch("/admin/confirm/:id",adminAuthMiddleware, handleConfirmBooking)
  .patch("/confirm/:id", handleConfirmBooking);
router
  .get("/user/:status",authMiddleware, handleGetBooking)
  .get("/admin",adminAuthMiddleware, handleGetAdminBooking)
  .get("/admin/:id",adminAuthMiddleware, handleGetBookingDetails)
  .get("/:id",authMiddleware, handleGetBookingDetails);
module.exports = { bookingRoute: router };
