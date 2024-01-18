const mongoose = require("mongoose");

async function connectDB() {
  try {
    console.log("process.env.DB_URL__", process.env.DB_URL);
    const connect = await mongoose.connect(process.env.DB_URL,{dbName:process.env.DB_NAME});
    console.log(`DB connected: ${connect.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

module.exports = connectDB;
