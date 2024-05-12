const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
