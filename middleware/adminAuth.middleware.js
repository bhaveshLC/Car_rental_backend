const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const adminAuthMiddleware = async (req, res, next) => {
  const token = req.headers["admin-authorization"].split(" ")[1];
  console.log(token);

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
    if (user.role != "admin") {
      return res.status(401).json({ message: "Unauthorized user" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error during token verification:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};
module.exports = { adminAuthMiddleware };
