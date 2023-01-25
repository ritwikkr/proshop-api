import express from "express";
import path from "path";
import cors from "cors";

import connectDB from "./db/connectDB.js";
import productRoute from "./router/productRoute.js";
import userRoute from "./router/userRoutes.js";
import orderRoute from "./router/orderRoutes.js";
const app = express();

// Embedding .env file
import dotenv from "dotenv";
dotenv.config();

// Connecting database

// Parsing body
app.use(express.json());

app.use(cors());
// Routes

app.use("/api/v1/product", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/order", orderRoute);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

function start() {
  const PORT = process.env.PORT || 5000;
  try {
    connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running at PORT:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();
