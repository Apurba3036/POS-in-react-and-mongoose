const mongoose = require("mongoose");

const billSchema = mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerNumber: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    pamentMode: {
      type: String,
      required: true,
    },
    paymentstatus: {
      type: String,
      default:"Paid"
    },

    cartItems: {
      type: Array,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamp: true }
);

const Bills = mongoose.model("bills", billSchema);

module.exports = Bills;
