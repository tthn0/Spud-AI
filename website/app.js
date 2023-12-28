const express = require("express");
const path = require("path");
const app = express();

// Set up static assets directory
app.use(express.static(path.join(__dirname, "public")));

// Set the view engine to EJS
app.set("view engine", "ejs");

// Specify the custom path for EJS views
app.set("views", path.join(__dirname, "./src/views"));

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
const indexRouter = require("./src/routes");
const apiRouter = require("./src/routes/api");
app.use("/", indexRouter);
app.use("/api/", apiRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
