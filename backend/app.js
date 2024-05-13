const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();
const bodyParser = require('body-parser');

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
app.use(express.json());
app.use(bodyParser.json());

// routes
app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});


/*
Implementing user functionality 
*/

///This should be running properly, still need to test it with a number of users
// display all  users
app.get("/users", async (req, res) => {
  res.json(await User.find({}).exec());
}); 

//// Function is not running properly...I'm not sure what is going on?
// something to do with the database ---> I have a 2 scripts to showcase it on postman
// run them and you'll see there's some initial value in the database...could be a port issue?
//sign up/log in function
app.post("/users", async (req, res) => {
  const user = new User();
  const found = await user.checkSave(req.body);
  res.json(found);
});

// start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
