const mongoose = require("mongoose");

async function connectToDB() {
  await mongoose.connect(process.env.MONGO_URI);
}

module.exports = connectToDB;
