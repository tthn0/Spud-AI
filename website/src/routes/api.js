const express = require("express");
const router = express.Router();

const {
  getMembers,
  postMembers,
  deleteLog,
  getLog,
  postLog,
} = require("../controllers/api");

router.get("/log/:psid?", getLog);
router.post("/log", postLog);
router.delete("/log/:id", deleteLog);

router.get("/members/:psid?", getMembers);
router.post("/members", postMembers);

module.exports = router;
