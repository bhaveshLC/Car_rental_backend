const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    mileage: { type: Number, required: true },
    color: { type: String },
    city: { type: String, required: true },
    carLocation: { type: String, required: true },
    features: { type: [String] },
    seats: { type: Number, required: true },
    cancellation: { type: Boolean, required: true },
    fuelType: { type: String, enum: ["petrol", "diesel"], lowercase: true },
    transmission: {
      type: String,
      enum: ["manual", "automatic"],
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    securityDeposit: { type: String, required: true },
    availabilityStatus: { type: Boolean, required: true, default: true },
    carImage: { type: String, required: true },
    carNumber: { type: String, required: true },
    DeliveryType: {
      type: String,
      enum: ["self", "delivered"],
      default: "self",
    },
  },
  {
    collection: "Car",
    timestamps: true,
  }
);

const Car = mongoose.model("Car", carSchema);
module.exports = { Car };
