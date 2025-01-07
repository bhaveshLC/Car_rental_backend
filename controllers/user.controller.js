const User = require("../models/user.model");

async function handleRegisterUser(req, res) {
  console.log(req.body);
  const { name, username, password, phoneNumber } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    return res.json({ message: "User Already Exists..." });
  }
  const newUser = await User.create({
    name,
    username,
    password,
    phoneNumber,
    role: "user",
    subscriptionType: "standard",
    totalBookings: 0,
  });
  const userWithoutPassword = newUser.toObject();
  delete userWithoutPassword.password;
  return res.status(200).json(userWithoutPassword);
}
async function handleGetUser(req, res) {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found..." });
  }
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  return res.status(200).json(userWithoutPassword);
}
async function handleGetSubscription(req, res) {
  const { name, cardNumber, expiryDate, cvv, totalAmount } = req.body;
  const user = req.user;
  console.log(user);

  user.subscriptionType = "premium";
  await user.save();
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  return res.status(200).json(userWithoutPassword);
}
async function handleUpdateUser(req, res) {
  const { name, phoneNumber } = req.body;

  const user = req.user;
  user.name = name;
  user.phoneNumber = phoneNumber;
  await user.save();
  return res.status(200).json(user);
}
module.exports = {
  handleRegisterUser,
  handleGetSubscription,
  handleGetUser,
  handleUpdateUser,
};
