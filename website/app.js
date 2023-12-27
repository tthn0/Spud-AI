const express = require("express");
const path = require("path");
const app = express();

// Set up static assets directory
app.use(express.static(path.join(__dirname, "public")));

// Set the view engine to ejs
app.set("view engine", "ejs");

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Middleware for logging incoming requests
app.use((req, res, next) => {
  const formatNumber = (num) => num.toString().padStart(2, "0");
  const now = new Date();
  const hours = formatNumber(now.getHours());
  const minutes = formatNumber(now.getMinutes());
  const seconds = formatNumber(now.getSeconds());
  const time = `${hours}:${minutes}:${seconds}`;
  console.log(time, {
    method: req.method,
    url: req.url,
    ip: req.ip,
  });
  next();
});

// Load the application logic
const defaultRouter = require("./src/routes");
const apiRouter = require("./src/api");
app.use("/", defaultRouter);
app.use("/api/", apiRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
