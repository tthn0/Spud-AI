const express = require("express");
const router = express.Router();

const {
  getTestLogs,
  getLogs,
  postLogs,
  deleteLogs,
  getTestMembers,
  getMembers,
  postMembers,
} = require("../controllers/api");

router.get("/testlogs", getTestLogs);
router.get("/logs/:psid?", getLogs);
router.post("/logs", postLogs);
router.delete("/logs/:id", deleteLogs);

router.get("/testmembers", getTestMembers);
router.get("/members/:psid?", getMembers);
router.post("/members", postMembers);

module.exports = router;
