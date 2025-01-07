const mongoose = require("mongoose");

const connectToDB = async (url) => {
  mongoose
    .connect(url)
    .then(() => console.log("Database Connected Successfully."))
    .catch((err) => console.log(err));
};
module.exports = connectToDB;
