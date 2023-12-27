const express = require("express");
const router = express.Router();

const mysql = require("mysql2/promise");
const creds = require("../config/creds.json");
const pool = mysql.createPool(creds);

const handleResponse = (res, data, status = 200) => {
  if (data instanceof Error) {
    Object.defineProperties(data, {
      message: {
        enumerable: true,
      },
      stack: {
        enumerable: true,
      },
    });
  }
  res.setHeader("Content-Type", "application/json");
  res.status(status).send(JSON.stringify(data, null, 2));
};

const query = async (sql, params) => {
  const [rows, fields] = await pool.execute(sql, params);
  return [rows, fields];
};

router.post("/log", async (req, res) => {
  try {
    await query("INSERT INTO log (psid, timestamp) VALUES (?, ?)", [
      req.body.psid,
      Date.now(),
    ]);
    handleResponse(res, `Logged PSID ${req.body.psid}`, 200);
  } catch (err) {
    handleResponse(res, err, 500);
  }
});

router.get("/log", async (req, res) => {
  const psid = req.query.psid;

  const sql = psid
    ? "SELECT * FROM log INNER JOIN members ON log.psid = members.psid WHERE log.psid = ?"
    : "SELECT * FROM log INNER JOIN members ON log.psid = members.psid";
  const params = psid ? [psid] : [];

  try {
    const [rows, _] = await query(sql, params);
    handleResponse(res, rows, 200);
  } catch (err) {
    handleResponse(res, err, 500);
  }
});

router.post("/members", async (req, res) => {
  const { psid, email, password, first, last, discord } = req.body;

  try {
    await query(
      "INSERT INTO members (psid, email, password, first, last, discord) VALUES (?, ?, ?, ?, ?, ?)",
      [psid, email, password, first, last, discord]
    );
    handleResponse(res, `Registered PSID ${psid}`, 200);
  } catch (err) {
    handleResponse(res, err, 500);
  }
});

router.get("/members", async (req, res) => {
  const psid = req.query.psid;

  const sql = psid
    ? "SELECT * FROM members WHERE psid = ?"
    : "SELECT * FROM members";
  const params = psid ? [psid] : [];

  try {
    const [rows, _] = await query(sql, params);
    handleResponse(res, rows, 200);
  } catch (err) {
    handleResponse(res, err, 500);
  }
});

module.exports = router;
