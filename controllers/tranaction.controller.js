const { Car } = require("../models/car.model");
const { Transaction } = require("../models/transaction.model");

async function getTransaction(req, res) {
  const user = req.user;
  console.log(user);
  const userTransaction = await Transaction.find({})
    .populate({
      path: "booking",
      match: { carOwner: user._id },
      populate: {
        path: "user",
      },
    })
    .exec();
  const filteredTransactions = userTransaction.filter(
    (transaction) => transaction.booking
  );
  return res.status(200).json(filteredTransactions);
}
module.exports = { getTransaction };
