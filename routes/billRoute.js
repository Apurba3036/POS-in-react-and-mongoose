const express = require("express");
const {
  addIBillsController,
  getBillsControler,
} = require("../controllers/billsControler");
const router = express.Router();

// routes

// Method - Post
router.post("/add-bills", addIBillsController);

// MEthod -GET

router.get("/get-bills", getBillsControler);

module.exports = router;
