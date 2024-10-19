const express = require("express");
const {
  loginControler,
  registerController,
} = require("../controllers/userControler");
const router = express.Router();

// routes
// Method - get
router.post("/login", loginControler);

// Method - Post
router.post("/register", registerController);

module.exports = router;
