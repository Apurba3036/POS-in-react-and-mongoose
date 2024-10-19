const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotanv = require("dotenv");
require("colors");
const connectDb = require("./config/config");
const mongoose = require("mongoose"); // Use require instead of import
const axios = require("axios"); // Use
const Bills = require("./models/billsModel");
const SslCommerze = require("./models/sslModel");
// dotenv
dotanv.config();
// db config
connectDb();

// rest object
const app = express();

// midlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/bills", require("./routes/billRoute"));

// PORT
const PORT = process.env.PORT || 8080;

app.post('/create-payment', async (req, res) => {
  try {
    // Create a unique transaction ID
    const trid = new mongoose.Types.ObjectId().toString();
    const paymentinfo = req.body;
    // console.log(paymentinfo)
    // Prepare data for SSLCommerz payment gateway
    const data = {
      store_id: "atten66f2d7b8551b1",
      store_passwd: "atten66f2d7b8551b1@ssl",
      total_amount: paymentinfo.totalAmount,
      currency: 'BDT',
      tran_id: trid,
      success_url: `http://localhost:8080/success-payment/${trid}`,
      fail_url: 'http://localhost:3030/fail',
      cancel_url: 'http://localhost:3030/cancel',
      ipn_url: 'http://localhost:3030/ipn',
      shipping_method: 'Courier',
      product_name: 'Hall Booking',
      product_category: 'Service',
      product_profile: 'general',
      cus_name: paymentinfo.customerName,
      cus_email: 'customer@example.com',
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: paymentinfo.customerNumber,
      cus_fax: '01711111111',
      shipping_method: "NO",
      multi_card_name: "mastercard,visacard,amexcard",
      value_a:  paymentinfo.customerName,
      value_b:  paymentinfo.customerNumber
    };

    

    // Send the payment request to SSLCommerz
    const response = await axios({
      method: "POST",
      url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
      data: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    });
    
console.log(response)
    res.send({
      // Return the payment URL to the client
        paymentUrl: response.data.GatewayPageURL
      });
   
      const sslPayment = new SslCommerze({
        transactionid: trid,
       
        ...paymentinfo  // Transaction ID
          // Default status
        
      });
  
      await sslPayment.save(); 
    



  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).send("Failed to create payment");
  }
});


app.post('/success-payment/:trid', async (req, res) => {
  const { trid } = req.params;

  try {
      // Fetch payment info from sslPayment collection
      const sslPayment = await SslCommerze.findOne({ transactionid: trid });

      if (!sslPayment) {
          return res.status(404).json({ message: 'Payment not found' });
      }

      // Extract relevant information from req.body
      const {
          amount,           // Total amount for the bill
          card_type,        // Payment method
          status,           // Payment status
          store_amount,     // Amount stored
          tran_date,        // Transaction date
      } = req.body;

      // Proceed only if the payment status is VALID
      if (status === "VALID") {
          // Create a new bill using the payment information from the request
          const newBill = new Bills({
              customerName: sslPayment.customerName,
              customerNumber: sslPayment.customerNumber,
              totalAmount: parseFloat(amount), // Convert to float
              tax: parseFloat(((parseFloat(store_amount) / 100) * 10).toFixed(2)), // Calculate tax based on store_amount
              pamentMode: card_type,
              cartItems: sslPayment.cartItems,
              date: new Date(tran_date) // Set the date to the transaction date
          });

          // Save the bill to the database
          await newBill.save();

          // Redirect to success page
          return res.redirect("http://localhost:3000/success");
      } else {
          return res.status(400).json({ message: 'Payment status is not valid' });
      }
  } catch (error) {
      console.error("Error processing payment: ", error);
      return res.status(500).json({ message: 'Failed to save payment and bill', error });
  }
});

// listen
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}}`.bgCyan.white);
});
