// require

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const User = require("./models/user.model");
require("./config/database");
require("./config/passport");
require("dotenv").config();

// app.use
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

// Home route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Home Page<h1/>");
});

//register route
app.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) return res.status(400).send("user already exist");

    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      const newUser = new User({
        username: req.body.username,
        password: hash,
      });
      await newUser.save().then(res.json("user Create Succesfully"));
    });
  } catch (error) {
    res.status(500).send(error.massage);
  }
});

// login route
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(401).send("user is not found");
    if (!bcrypt.compareSync(req.body.password, user.password))
      return res.status(401).send("password is not found");
    const payload = {
      id: user._id,
      username: user.username,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY);
    return res.status(200).send({
      success: true,
      massage: " user is log in succesfully",
      token: "Bearer " + token,
    });
  } catch (error) {
    res.status(500).send(error.massage);
  }
});

// profile route
app.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    return res.status(200).send({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
      },
    });
  }
);
// resource not found
app.use((req, res, next) => {
  res.status(404).json({ massage: " route not found " });
});
// Server error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
