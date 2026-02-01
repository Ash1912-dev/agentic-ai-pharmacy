const mongoose = require("mongoose");
mongoose.connection.once("open", () => {
  console.log("✅ Connected DB name:", mongoose.connection.name);
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
