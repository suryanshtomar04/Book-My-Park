const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Try connecting to the specified URI first with a short timeout
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`⚠️  Local MongoDB not found (${error.message}). Starting in-memory database...`);
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    try {
      await mongoose.connect(uri);
      console.log(`✅ MongoDB connected: ${mongoose.connection.host} (In-Memory)`);
    } catch (inMemoryError) {
      console.error(`❌ In-Memory MongoDB connection error: ${inMemoryError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
