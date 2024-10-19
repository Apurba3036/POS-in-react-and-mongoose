const mongoose = require("mongoose");

// Define the schema for cart items
const cartItemSchema = mongoose.Schema({
    _id: {
        type: String, // Assuming ObjectId is stored as a string
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1, // Default quantity if not provided
    },
});

// Define the schema for the sslcommerze payment
const sslcommerzeSchema = mongoose.Schema(
    {
        transactionid: {
            type: String,
            required: true,
        },
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
        cartItems: {
            type: [cartItemSchema], // Array of cart item schemas
            required: true,
        },
        date: {
            type: Date,
            default: Date.now, // Set default to current date
        },
    },
    { timestamps: true } // Automatically create createdAt and updatedAt fields
);

// Create the model
const SslCommerze = mongoose.model("SslCommerze", sslcommerzeSchema);

module.exports = SslCommerze;
