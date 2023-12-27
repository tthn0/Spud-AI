const express = require("express");
const router = express.Router();

const mysql = require("mysql2/promise");
const creds = require("../config/creds.json");
const pool = mysql.createPool(creds);

const handleResponse = (res, message, status = 200) => {
  res.status(status).json({ Info: message });
};

router.post("/log", async (req, res) => {
  // Todo: check for authorization
  pool
    .execute("INSERT INTO log (psid, timestamp) VALUES (?, ?)", [
      req.body.psid,
      Date.now(),
    ])
    .then(([rows, fields]) => {
      handleResponse(res, "Successfully logged a member", 200);
    })
    .catch((err) => {
      handleResponse(res, err.message, 500);
    });
});

router.get("/log", async (req, res) => {
  // Todo: check for authorization
  const psid = req.query.psid;

  let sql = psid ? "SELECT * FROM log WHERE psid = ?" : "SELECT * FROM log";
  let params = psid ? [psid] : [];

  pool
    .execute(sql, params)
    .then(([rows, fields]) => {
      if (rows.length > 0) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(rows, null, 2));
      } else {
        handleResponse(res, "No logs found", 200);
      }
    })
    .catch((err) => {
      handleResponse(res, err.message, 500);
    });
});

router.post("/members", async (req, res) => {
  // Todo: check for authorization
  pool
    .execute(
      "INSERT INTO members (psid, email, password, first, last, discord) VALUES (?, ?, ?, ?, ?, ?)",
      [
        req.body.psid,
        req.body.email,
        req.body.password,
        req.body.first,
        req.body.last,
        req.body.discord,
      ]
    )
    .then(([rows, fields]) => {
      handleResponse(res, "Successfully registered a new member", 200);
    })
    .catch((err) => {
      handleResponse(res, err.message, 500);
    });
});

router.get("/members", async (req, res) => {
  // Todo: check for authorization
  const id = req.query.id;

  let sql = id ? "SELECT * FROM members WHERE id = ?" : "SELECT * FROM members";
  let params = id ? [id] : [];

  pool
    .execute(sql, params)
    .then(([rows, fields]) => {
      if (rows.length > 0) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(rows, null, 2));
      } else {
        handleResponse(res, "No members found", 200);
      }
    })
    .catch((err) => {
      handleResponse(res, err.message, 500);
    });
});

module.exports = router;
