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
/*
food for thought, I change the implementation to be using 
the res functions more so that the errors are returned as status
that allows the function to end when it hits an error 
~~ might make things better for us down the line?
*/

// functions for the users route...what should post have?
app.get("/users", async (req, res) => {
  res.json(await User.find({}).exec());
}); 

// search for user by username or name
app.get("/user", async (req,res) =>{
  res.json(await User.find({$or: [{ name: req.body.name }, 
                                  { username: req.body.username }]}).exec());
});

app.post("/user/login", async (req,res) =>{
  res.json( await User.login(req.body));
});

app.post("/user/signup", async (req,res) => {
  res.json(await User.signup(req.body));
}); 

// delete by username, will be adjusting to be more restrictive 
// but for now this is for testing purposes
app.post("/user/delete", async (req,res) =>{
  res.json (await User.findOneAndDelete(req.body));
});


// start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
