import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./db/connectDB.js";
import productRoute from "./router/productRoute.js";
import userRoute from "./router/userRoutes.js";
import orderRoute from "./router/orderRoute.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import paymentRoute from "./router/paymentRourte.js";

const app = express();

// Embedding .env file
dotenv.config();

// Parsing body
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1/product", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);

app.get("/api/v1/getNodeEnv", (req, res) => {
  return res.json({ msg: process.env.NODE_ENV });
});

app.use(notFound);
app.use(errorHandler);

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
