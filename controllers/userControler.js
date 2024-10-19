const userModel = require("../models/userModel");

// Login user
const loginControler = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await userModel.findOne({ userId, password, verified: true });
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(401).json({
        message: "Login Failed",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
    console.log(error);
  }
};

// Register user
const registerController = async (req, res) => {
  try {
    const newUser = new userModel({ ...req.body, verified: true });
    await newUser.save();
    res.status(201).send("New User Added successfully!!");
  } catch (error) {
    res.status(400).json({
      message: "Error registering user",
      error: error.message,
    });
    console.log(error);
  }
};

module.exports = {
  loginControler,
  registerController,
};
