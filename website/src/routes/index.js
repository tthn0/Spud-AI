const express = require("express");
const router = express.Router();

const { getIndex, getRegister, getLogs } = require("../controllers");

router.get("/", getIndex);
router.get("/register", getRegister);
router.get("/logs", getLogs);

module.exports = router;
