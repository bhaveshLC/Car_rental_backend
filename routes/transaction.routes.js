const express = require("express");
const { getTransaction } = require("../controllers/tranaction.controller");
const { adminAuthMiddleware } = require("../middleware/adminAuth.middleware");
const router = express.Router();
router.get("/admin",adminAuthMiddleware, getTransaction);
module.exports = { transactionRoute: router };
