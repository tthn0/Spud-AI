const express = require("express");
const router = express.Router();

const { getIndex, getRegister, getLog } = require("../controllers");

router.get("/", getIndex);
router.get("/register", getRegister);
router.get("/log/:psid?", getLog);

module.exports = router;
