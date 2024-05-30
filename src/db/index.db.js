import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );

    console.log(
      "mongodb connected successfully running on port DB Host =>",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log(error, "mongodb connection failed!");
    process.exit(1);
  }
};

export default connectDB
