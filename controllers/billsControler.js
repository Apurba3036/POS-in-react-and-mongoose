const billModel = require("../models/billsModel");

// add-items
const addIBillsController = async (req, res) => {
  try {
    const newBill = new billModel(req.body);
    await newBill.save();
    res.send("Bill Created sucessfully !!");
  } catch (error) {
    res.send("somethings wents wrong");
    console.log(error);
  }
};

// get bills data
const getBillsControler = async (req, res) => {
  try {
    const bills = await billModel.find();
    res.send(bills);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addIBillsController,
  getBillsControler,
};
