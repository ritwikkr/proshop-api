import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  isPaid: Boolean,
  amount: Number,
  razorpay: {
    orderId: String,
    paymentId: String,
    signature: String,
  },
});

export default mongoose.model("Order", orderSchema);
