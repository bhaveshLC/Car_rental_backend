const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema(
  {
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: "credit card" },
    booking: {
      type: mongoose.Schema.ObjectId,
      ref: "CarBooking",
      required: true,
    },
    cardNumber: { type: String, required: true },
    cardHolderName: { type: String, required: true },
    cvv: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = { Transaction };
