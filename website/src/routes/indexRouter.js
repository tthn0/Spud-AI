const express = require("express");
const router = express.Router();

const {
  renderIndex,
  renderRegister,
  renderLogs,
} = require("../controllers/indexController");

router.get("/", renderIndex);
router.get("/register", renderRegister);
router.get("/logs", (req, res) => renderLogs(req, res, false));
router.get("/testlogs", (req, res) => renderLogs(req, res, true));

module.exports = router;
