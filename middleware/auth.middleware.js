const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();
const authMiddleware = async (req, res, next) => {
  let token = "";

  if (req.originalUrl.includes("admin")) {
    token =
      req.headers["admin-authorization"] &&
      req.headers["admin-authorization"].split(" ")[1];
  } else {
    token =
      req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[1];
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Invalid token. Please authenticate." });
    }
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found, please authenticate." });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error during token verification:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};
module.exports = { authMiddleware };
