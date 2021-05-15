const mongoose = require("mongoose");
require("dotenv").config();
const uriDB = process.env.URI_DB;

const db = mongoose.connect(uriDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  poolSize: 5,
});
mongoose.connection.on("connected", () => {
  console.log("Database connection successful");
});
mongoose.connection.on("error", (err) => {
  console.log(`error M ${err.message}`);
});
mongoose.connection.on("disconnected", () => {
  console.log(" M disconnected");
});
process.on("SIGINT", async () => {
  mongoose.connection.close(() => {
    console.log("Disconnected from M");
    process.exit();
  });
});

module.exports = db;
