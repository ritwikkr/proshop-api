import asyncHandler from "../middleware/asyncHandler.js";
import Razorpay from "razorpay";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

// Initialize Razorpay with API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY, // Replace with your test API key
  key_secret: process.env.RAZOR_PAY_SECRET, // Replace with your test API secret
});

const stripePayment = asyncHandler(async (req, res) => {
  const { amount, currency, payment_method } = req.body;

  // Create a payment intent with the amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    payment_method,
    confirm: true,
  });

  res.json({ paymentIntent });
});

const razorpayPayment = asyncHandler(async (req, res) => {
  const options = {
    amount: req.body.totalPrice * 100, // Amount in paise (e.g., 5000 paise = ₹50)
    currency: "INR",
    receipt: Math.random().toString(),
  };

  const response = await razorpay.orders.create(options);
  res.json(response);
});

export { stripePayment, razorpayPayment };
