const { default: mongoose } = require("mongoose");
const { Car } = require("../models/car.model");
const { CarBooking } = require("../models/carBooking.model");
const { Transaction } = require("../models/transaction.model");
const User = require("../models/user.model");

async function handleBooking(req, res) {
  const car = req.params.carId;
  const user = req.user;
  const {
    bookingDate,
    startDate,
    endDate,
    totalPrice,
    paymentStatus,
    license,
    bookingStatus,
    cancellationReason,
    specialRequests,
  } = req.body;
  try {
    const currCar = await Car.findOne({ _id: car }).populate("owner");
    if (!currCar) {
      return res.status(404).json({ message: "Car not Found..." });
    }
    if (license.length < 16) {
      return res.status(400).json({ message: "Enter Valid license" });
    }
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0);
    currentDate = currentDate.getTime();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (currentDate >= start.getTime() || currentDate >= end.getTime()) {
      return res.status(400).json({ message: "Date must be from future" });
    }
    const existingBooking = await CarBooking.findOne({
      car,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
        { startDate: { $gte: startDate, $lte: endDate } },
        { endDate: { $gte: startDate, $lte: endDate } },
      ],
    });

    if (existingBooking) {
      return res
        .status(409)
        .json({ message: "Car is already booked during this time range" });
    }

    user.totalBookings++;
    await user.save();
    const booking = await CarBooking.create({
      car,
      user: user._id,
      bookingDate,
      startDate,
      endDate,
      totalPrice,
      license,
      paymentStatus,
      bookingStatus,
      cancellationReason,
      specialRequests,
      carOwner: currCar.owner,
    });
    return res.status(200).json(booking);
  } catch (err) {
    console.log(err);
    return res.status(500).json("Something went wrong");
  }
}
async function handleGetBooking(req, res) {
  const user = req.user;
  const { status } = req.params;
  let statusesToQuery = [status];
  if (status === "pending") {
    statusesToQuery = ["pending", "confirmed"];
  }

  try {
    // Fetch bookings based on the user and booking status
    const bookings = await CarBooking.find({
      user: user._id,
      bookingStatus: { $in: statusesToQuery },
    }).populate("car");

    let currentDate = new Date();
    currentDate.setHours(0, 0, 0);
    for (let booking of bookings) {
      if (
        new Date(booking.endDate) <= currentDate &&
        booking.bookingStatus !== "completed"
      ) {
        booking.bookingStatus = "completed";

        await booking.save();
      }
    }
    return res.json(bookings);
    // const results = await CarBooking.find({
    //   user: user._id,
    //   bookingStatus: { $in: statusesToQuery },
    // }).populate("car");
    // return res.json(results);
  } catch (error) {
    console.log(error);
  }
}
async function handleGetAdminBooking(req, res) {
  const user = req.user;
  const results = await CarBooking.find({
    carOwner: user._id,
  }).populate("car");
  let totalEarning = 0;
  let totalSeats = 0;
  let pendingRides = 0;
  let cancelledRides = 0;
  results.forEach((booking) => {
    if (booking.bookingStatus != "cancelled") {
      totalEarning += booking.totalPrice || 0;
    }
    totalSeats += booking.car.seats || 0;
    if (
      booking.bookingStatus == "confirmed" ||
      booking.bookingStatus == "pending"
    ) {
      pendingRides++;
    }
    if (booking.bookingStatus == "cancelled") {
      cancelledRides++;
    }
  });
  const cancellationRate = ((cancelledRides / results.length) * 100).toFixed(2);
  return res.json({
    results,
    totalEarning,
    totalSeats,
    pendingRides,
    cancellationRate,
  });
}
async function handleGetBookingDetails(req, res) {
  const { id } = req.params;
  const bookingDetails = await CarBooking.findOne({ _id: id }).populate("car");
  if (!bookingDetails) {
    return res.status(404).json({ message: "No Booking Found..." });
  }
  bookingDetails.user = req.user;
  return res.status(200).json(bookingDetails);
}
async function handlePayment(req, res) {
  const { id } = req.params;
  const { name, cardNumber, expiryDate, cvv, totalAmount } = req.body;
  const [year, month] = expiryDate.split("-");
  const currentDate = new Date();

  const expiryDateObj = new Date(`${year}-${month}-01`);
  expiryDateObj.setMonth(expiryDateObj.getMonth() + 1);

  if (expiryDateObj <= currentDate) {
    return res
      .status(400)
      .json({ message: "Expiry date must be in the future" });
  }
  const booking = await CarBooking.findOne({ _id: id });
  if (!booking) {
    return res.status(404).json({ message: "Booking not found..." });
  }
  booking.paymentStatus = "paid";
  await booking.save();
  const transaction = await Transaction.create({
    totalAmount,
    booking: id,
    cardHolderName: name,
    cardNumber,
    cvv,
  });
  return res.status(200).json(booking);
}
async function handleCancelBooking(req, res) {
  const { id } = req.params;
  const { reason } = req.body;
  console.log(req.body);

  const bookingDetails = await CarBooking.findOne({ _id: id }).populate("car");
  if (!bookingDetails) {
    return res.status(404).json({ message: "No Booking Found..." });
  }
  bookingDetails.bookingStatus = "cancelled";
  bookingDetails.cancellationReason = reason;
  bookingDetails.paymentStatus = "Refunded";
  await bookingDetails.save();
  return res.status(200).json(bookingDetails);
}
async function handleConfirmBooking(req, res) {
  const { id } = req.params;
  const booking = await CarBooking.findByIdAndUpdate(
    id,
    {
      bookingStatus: "confirmed",
    },
    {
      new: true,
    }
  );
  if (!booking) {
    return res.status(404).json({ message: "No booking found..." });
  }
  return res.status(200).json(booking);
}
async function handleCouponCode(req, res) {
  const user = req.user;
  let { totalPrice, couponCode } = req.body;
  if (user.totalBookings != 0 && couponCode.toLowerCase() == "first5") {
    return res.status(400).json({ message: "Coupon Already used" });
  }
  if (couponCode.toLowerCase() == "first5" && user.totalBookings == 0) {
    totalPrice -= (totalPrice * 5) / 100;
    return res.json({ totalPrice, discount: 5 });
  }
  if (
    user.subscriptionType == "premium" &&
    couponCode?.toLowerCase() == "random"
  ) {
    let random = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
    totalPrice -= (totalPrice * random) / 100;
    return res.json({ totalPrice, discount: random });
  } else {
    return res.status(400).json({ message: "Invalid coupon code" });
  }
}
module.exports = {
  handleBooking,
  handleGetBooking,
  handleGetBookingDetails,
  handlePayment,
  handleCancelBooking,
  handleGetAdminBooking,
  handleConfirmBooking,
  handleCouponCode,
};
