import mongoose from "mongoose";

async function connectDB(url) {
  await mongoose.connect(url);
  console.log(`Database connected`);
}

export default connectDB;
