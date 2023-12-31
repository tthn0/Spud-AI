const express = require("express");
const router = express.Router();

const { getIndex, getRegister, getLogs } = require("../controllers");

router.get("/", getIndex);
router.get("/register", getRegister);
router.get("/logs", (req, res) => getLogs(req, res, false));
router.get("/testlogs", (req, res) => getLogs(req, res, true));

module.exports = router;
