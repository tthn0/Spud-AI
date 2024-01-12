// @ts-check

const express = require("express");
const { join } = require("path");

const { getUsers, postUsers, getLogs, postLogs, deleteLogs } = require(join(
  __dirname,
  "..",
  "controllers",
  "apiController"
));

const router = express.Router();

router.get("/testusers", (req, res) => getUsers(req, res, true));
router.get("/users", (req, res) => getUsers(req, res, false));
router.post("/users", postUsers);

router.get("/testlogs", (req, res) => getLogs(req, res, true));
router.get("/logs", (req, res) => getLogs(req, res, false));
router.post("/logs/:userId", postLogs);
router.delete("/logs/:logId", deleteLogs);

module.exports = router;
