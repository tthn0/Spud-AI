const express = require("express");
const router = express.Router();

const {
  postLog,
  getLog,
  postMembers,
  getMembers,
} = require("../controllers/api");

router.post("/log", postLog);
router.get("/log/:psid?", getLog);

router.post("/members", postMembers);
router.get("/members/:psid?", getMembers);

module.exports = router;
