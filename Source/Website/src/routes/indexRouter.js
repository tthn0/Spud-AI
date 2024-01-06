// @ts-check

const express = require("express");
const { join } = require("path");

const { renderIndex, renderRegister, renderLogs } = require(join(
  __dirname,
  "..",
  "controllers",
  "indexController"
));

const router = express.Router();

router.get("/", renderIndex);
router.get("/register", renderRegister);
router.get("/logs", (req, res) => renderLogs(req, res, false));
router.get("/testlogs", (req, res) => renderLogs(req, res, true));

module.exports = router;
