const express = require("express");
const router = express.Router();

const {
  getMembers,
  postMembers,
  deleteLogs,
  getLogs,
  postLogs,
} = require("../controllers/api");

router.get("/logs/:psid?", getLogs);
router.post("/logs", postLogs);
router.delete("/logs/:id", deleteLogs);

router.get("/members/:psid?", getMembers);
router.post("/members", postMembers);

module.exports = router;
