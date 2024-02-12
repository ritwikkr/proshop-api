import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";

import connectDB from "./db/connectDB.js";
import productRoute from "./router/productRoute.js";
import userRoute from "./router/userRoutes.js";
import orderRoute from "./router/orderRoute.js";
import Stripe from "stripe";

const app = express();

// Embedding .env file
dotenv.config();

// Parsing body
app.use(express.json());
app.use(cors());

// Initialize Razorpay with API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY, // Replace with your test API key
  key_secret: process.env.RAZOR_PAY_SECRET, // Replace with your test API secret
});

// Routes
app.use("/api/v1/product", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/order", orderRoute);

// Payment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});
app.post("/api/v1/payment", async (req, res) => {
  try {
    const { amount, currency, payment_method } = req.body;

    // Create a payment intent with the amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method,
      confirm: true,
    });

    res.json({ paymentIntent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to create a payment order
app.post("/api/v1/payment/razor", async (req, res) => {
  try {
    const options = {
      amount: req.body.totalPrice * 100, // Amount in paise (e.g., 5000 paise = ₹50)
      currency: "INR", // Currency code (INR for Indian Rupees)
      receipt: Math.random().toString(), // You can generate a receipt ID here
    };

    const response = await razorpay.orders.create(options);
    res.json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/v1/getNodeEnv", (req, res) => {
  return res.json({ msg: process.env.NODE_ENV });
});

function start() {
  const PORT = process.env.PORT || 5000;
  try {
    connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running at PORT:${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
start();
