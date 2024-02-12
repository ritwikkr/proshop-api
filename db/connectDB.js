import mongoose from "mongoose";

async function connectDB(url) {
  try {
    const conn = await mongoose.connect(url);
    console.log(`Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Database Error: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;
