const { Car } = require("../models/car.model");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");

async function handleCreateCar(req, res) {
  const {
    companyName,
    model,
    carNumber,
    year,
    pricePerDay,
    mileage,
    color,
    city,
    carLocation,
    features,
    seats,
    cancellation,
    fuelType,
    transmission,
    owner,
    securityDeposit,
    availabilityStatus,
    carImage,
    DeliveryType,
  } = req.body;

  const regex = /^[A-Z0-9-]{6,10}$/i;
  if (!carNumber && !regex.test(carNumber)) {
    return res.status(400).json({ message: "Enter valid car number" });
  }
  const existingCar = await Car.findOne({ carNumber });
  if (existingCar) {
    return res
      .status(400)
      .json({ message: "Car with that number is already present" });
  }
  const localFilePath = req.file.path;

  let result;
  try {
    result = await uploadToCloudinary(localFilePath);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
  const car = await Car.create({
    companyName,
    model,
    carNumber,
    year,
    pricePerDay,
    mileage,
    color,
    city,
    carLocation,
    features,
    seats,
    cancellation,
    fuelType,
    transmission,
    owner: req.user._id,
    securityDeposit,
    availabilityStatus,
    carImage: result.url,
    DeliveryType,
  });
  return res.json(car);
}

async function handleGetAllCars(req, res) {
  const cars = await Car.find({});
  const searchQuery = req.query.name?.toLowerCase() || "";
  const searchCity = req.query.city?.toLowerCase() || "";
  let filteredCars = cars.filter(
    (car) =>
      car.companyName.toLowerCase().includes(searchQuery) ||
      car.model.toLowerCase().includes(searchQuery)
  );
  filteredCars = filteredCars.filter((car) =>
    car.city.toLocaleLowerCase().includes(searchCity)
  );
  return res.status(200).json(filteredCars);
}

async function handleGetAdminCars(req, res) {
  const user = req.user;
  const cars = await Car.find({ owner: user._id });

  return res.status(200).json(cars);
}
async function handleGetCarDetails(req, res) {
  const { carId } = req.params;
  const car = await Car.findOne({ _id: carId }).populate("owner", "-password");

  if (!car) {
    return res.status(404).json({ message: "No car Found..." });
  }
  return res.status(200).json(car);
}
async function handleUpdateCar(req, res) {
  const {
    pricePerDay,
    city,
    carLocation,
    features,
    cancellation,
    securityDeposit,
    availabilityStatus,
    carImage,
    DeliveryType,
  } = req.body;
  const { id } = req.params;
  const existingCar = await Car.findByIdAndUpdate(
    id,
    {
      pricePerDay,
      city,
      carLocation,
      features,
      cancellation,
      securityDeposit,
      availabilityStatus,
      carImage,
      DeliveryType,
    },
    {
      new: true,
    }
  );
  if (!existingCar) {
    return res.status(404).json({ message: "No Car Found..." });
  }
  // await existingCar.save();
  return res.status(200).json(existingCar);
}
async function handleDeleteCar(req, res) {
  const { id } = req.params;
  const car = await Car.findByIdAndDelete(id);
  if (!car) {
    return res.status(404).json({ message: "Car not found..." });
  }
  return res.status(200).json({ message: "Car deleted Successfully." });
}
module.exports = {
  handleCreateCar,
  handleGetAllCars,
  handleGetCarDetails,
  handleUpdateCar,
  handleDeleteCar,
  handleGetAdminCars,
};
