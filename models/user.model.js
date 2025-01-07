const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    totalBookings: { type: Number, default: 0 },
    subscriptionType: {
      type: String,
      enum: ["premium", "standard"],
      default: "standard",
    },
  },
  {
    collection: "User",
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
