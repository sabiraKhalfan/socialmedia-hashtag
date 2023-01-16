import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("database connected".cyan);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
