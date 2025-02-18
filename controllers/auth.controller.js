const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;
async function handleLogin(req, res) {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, role: "user" });
    if (!user) {
      return res.status(404).json({ message: "User does not exists..." });
    }
    if (password !== user.password) {
      return res.status(400).json({ message: "Password does not match..." });
    }
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        username: user.username,
        phoneNumber: user.phoneNumber,
        subscriptionType: user.subscriptionType,
        role: user.role,
        totalBookings: user.totalBookings,
      },
      secret_key,
      {
        expiresIn: "2d",
      }
    );
    const userObj = user.toObject();
    delete userObj.password;
    return res.json({
      message: "User authenticate successfully",
      user: userObj,
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
}
async function handleAdminLogin(req, res) {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, role: "admin" });
    if (!user) {
      return res.status(404).json({ message: "User does not exists..." });
    }

    if (user.role != "admin") {
      return res
        .status(403)
        .json({ message: "Access restricted: Admin role required." });
    }
    if (password !== user.password) {
      return res.status(400).json({ message: "Password does not match..." });
    }
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        username: user.username,
        phoneNumber: user.phoneNumber,
        subscriptionType: user.subscriptionType,
        role: user.role,
        totalBookings: user.totalBookings,
      },
      secret_key,
      {
        expiresIn: "2d",
      }
    );
    return res.json({
      message: "User authenticate successfully",
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
}
module.exports = { handleLogin, handleAdminLogin };
