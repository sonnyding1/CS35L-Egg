const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const deleteRoutes = require("./routes/deleteRoutes");
const updateRoutes = require("./routes/updateRoutes");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
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
  apis: ["./app.js", "./models/*.js", "./routes/*.js"],
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
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(bodyParser.json());

// routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/file", fileRoutes);
app.use("/delete", deleteRoutes);
app.use("/update", updateRoutes);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
