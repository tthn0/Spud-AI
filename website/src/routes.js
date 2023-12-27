const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("[Load landing page here]");
});

router.get("/register", (req, res) => {
  res.render("register");
});

module.exports = router;
