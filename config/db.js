const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((m) => {
        console.log("MongoDB Connected Successfully!");
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("MongoDB Connection Failed:", error.message);
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;
