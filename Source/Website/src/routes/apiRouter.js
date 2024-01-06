// @ts-check

const express = require("express");
const { join } = require("path");

const { getMembers, postMembers, getLogs, postLogs, deleteLogs } = require(join(
  __dirname,
  "..",
  "controllers",
  "apiController"
));

const router = express.Router();

router.get("/testmembers", (req, res) => getMembers(req, res, true));
router.get("/members/:psid?", (req, res) => getMembers(req, res, false));
router.post("/members", postMembers);

router.get("/testlogs", (req, res) => getLogs(req, res, true));
router.get("/logs/:psid?", (req, res) => getLogs(req, res, false));
router.post("/logs", postLogs);
router.delete("/logs/:id", deleteLogs);

module.exports = router;
