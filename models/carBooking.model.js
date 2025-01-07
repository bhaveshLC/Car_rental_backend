const mongoose = require("mongoose");

const carBookingSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    carOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingDate: { type: Date, default: new Date() },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    license: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
      lowercase: true,
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      lowercase: true,
    },
    cancellationReason: { type: String },
    specialRequests: { type: String },
  },
  {
    collection: "CarBooking",
    timestamps: true,
  }
);

const CarBooking = mongoose.model("CarBooking", carBookingSchema);

module.exports = { CarBooking };
