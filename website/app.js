const express = require("express");
const path = require("path");
const app = express();

// Set up static assets directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Set the view engine to ejs
app.set("view engine", "ejs");

// Middleware for logging incoming requests
app.use((req, res, next) => {
  console.log(
    `${new Date().toLocaleString()}: ${req.method} ${req.url}, ${req.ip}`
  );
  next();
});

// Load the main application logic
const serverRouter = require("./src/routes");
const apiRouter = require("./src/api");
app.use("/", serverRouter);
app.use("/api/", apiRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
