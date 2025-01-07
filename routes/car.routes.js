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
  .post("", upload.single("carImage"), handleCreateCar)
  .get("", handleGetAllCars)
  .get("/admin", handleGetAdminCars)
  .get("/:carId", handleGetCarDetails)
  .patch("/:id", handleUpdateCar)
  .delete("/:id", handleDeleteCar);
module.exports = { carRoute: router };
