const express = require("express");
const {
  handleRegisterUser,
  handleGetSubscription,
  handleGetUser,
  handleUpdateUser,
  handleRegisterAdmin,
} = require("../controllers/user.controller");
const {
  handleLogin,
  handleAdminLogin,
} = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const router = express.Router();
router.post("/admin", handleRegisterAdmin);
router.get("/:id", handleGetUser);
router.patch("/admin", authMiddleware, handleUpdateUser);
router.patch("", authMiddleware, handleUpdateUser);
router.post("", handleRegisterUser);
router.post("/user/login", handleLogin);
router.post("/login", handleAdminLogin);
router.post("/subscribe", authMiddleware, handleGetSubscription);
module.exports = { userRoute: router };
