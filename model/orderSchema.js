import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    amount: { type: Number, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
