const express = require("express");
const { join } = require("path");

const app = express();

// Set up socket.io and export it, so it can be used in other files
const server = require("http").createServer(app);
const io = require("socket.io")(server);
module.exports = io;

// Set up static assets directory
app.use(express.static(join(__dirname, "public")));

// Set the view engine to EJS
app.set("view engine", "ejs");

// Specify the custom path for EJS views
app.set("views", join(__dirname, "./src/views"));

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Middleware for logging incoming requests
app.use((req, _, next) => {
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

// Load application logic
app.use("/", require("./src/routes/indexRouter"));
app.use("/api/", require("./src/routes/apiRouter"));

const port = process.env.PORT || 8000;
server.listen(port, () => {
  global.ORIGIN_URL = `http://localhost:${port}`;
  console.log(`Server is running on ${global.ORIGIN_URL}`);
});
