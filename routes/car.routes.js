const express = require("express");
const {
  handleCreateCar,
  handleGetAllCars,
  handleGetCarDetails,
  handleUpdateCar,
  handleDeleteCar,
  handleGetAdminCars,
} = require("../controllers/car.controller");
const multer = require("multer");
const { authMiddleware } = require("../middleware/auth.middleware");
const { adminAuthMiddleware } = require("../middleware/adminAuth.middleware");
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
router
  .post("", authMiddleware, upload.single("carImage"), handleCreateCar)
  .get("", authMiddleware, handleGetAllCars)
  .get("/admin", adminAuthMiddleware, handleGetAdminCars)
  .get("/:carId", handleGetCarDetails)
  .patch("/:id", adminAuthMiddleware, handleUpdateCar)
  .delete("/:id", adminAuthMiddleware, handleDeleteCar);
module.exports = { carRoute: router };
