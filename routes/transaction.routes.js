const express = require("express");
const { getTransaction } = require("../controllers/tranaction.controller");
const router = express.Router();
router.get("/admin", getTransaction);
module.exports = { transactionRoute: router };
