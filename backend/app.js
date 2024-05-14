const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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

// routes
app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// the below 2 routes are for demonstration purposes
// that we have connected to the db
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
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user and save it to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
app.post("/users", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

// start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
