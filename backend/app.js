const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();
const bodyParser = require('body-parser');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = process.env.PORT || 3000;

const StatusCodes ={
  SUCCESS: 200,
  USER_NOT_FOUND: 401,
  WRONG_PASSWORD: 402,
  USERNAME_TAKEN: 403,
  PASSWORD_FAULT: 404,
}

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Swagger
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Egg API",
    version: "1.0.0",
    description: "This is the backend API for the Egg application.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
};
const options = {
  swaggerDefinition,
  // include relative paths to files containing OpenAPI definitions
  apis: ["./app.js", "./models/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Retrieve a list of users from the database.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
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
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser && await bcrypt.compare(req.body.password, existingUser.password)) {
    return res.json(existingUser);
  }
  else if (existingUser){
    return res.status(StatusCodes.WRONG_PASSWORD).json({ error: "Wrong Password!" });
  }
  return res.status(StatusCodes.USER_NOT_FOUND).json({error: "User not found!"});
});

app.post("/user/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();
    return res.json(newUser);

  } catch (error) {
    if (error.code === 11000) { // 11000 is the error code for duplicate key in MongoDB
      return res.status(StatusCodes.USERNAME_TAKEN).json({ error: "Username Taken!" });
    }
    // For other errors, return a generic error response
    return res.status(StatusCodes.PASSWORD_FAULT).json({ error: "Password Fault, Encryption Failed!" });
  }
});

// delete by username, will be adjusting to be more restrictive 
// but for now this is for testing purposes
app.post("/user/delete", async (req,res) =>{
  const user = await User.findOneAndDelete(req.body);
  if (user == null) {
    return res.status(StatusCodes.USER_NOT_FOUND).json({error: "User not found!"});
  }
  return res.json(user);
});


// start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
