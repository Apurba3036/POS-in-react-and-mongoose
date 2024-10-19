const express = require("express");
const {
  getItemControler,
  addItemController,
  editItemController,
  deleteItemController,
} = require("../controllers/itemControler");
const router = express.Router();

// routes
// Method - get
router.get("/get-item", getItemControler);

// Method - Post
router.post("/add-item", addItemController);

// Method PUT

router.put("/edit-item", editItemController);

// method - DELETE

router.post("/delete-item", deleteItemController);

module.exports = router;
