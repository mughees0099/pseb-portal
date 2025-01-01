import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://localhost:27017/pseb");

    console.log(
      `MongoDB Connected: ${conn.connection.host + " " + conn.connection.port}`
    );
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

export default connectDB;
