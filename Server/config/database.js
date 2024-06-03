const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database is conencted");
  })
  .catch((error) => {
    console.log(error.massage);
    process.exit(1);
  });
