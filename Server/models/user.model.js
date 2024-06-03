const mongoose = require("mongoose");
const userschema = mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    unique: true,
  },
});

const User = mongoose.model("User", userschema);
module.exports = User;
