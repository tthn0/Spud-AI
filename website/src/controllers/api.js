const mysql = require("mysql2/promise");
const creds = require("../../config/creds.json");
const pool = mysql.createPool(creds);

module.exports = {
  postLog: async (req, res) => {
    try {
      await query("INSERT INTO log (psid, timestamp) VALUES (?, ?)", [
        req.body.psid,
        Date.now(),
      ]);
      handleResponse(res, `Logged PSID ${req.body.psid}`, 200);
    } catch (err) {
      handleResponse(res, err, 500);
    }
  },
  getLog: async (req, res) => {
    const psidCondition = req.params.psid ? "WHERE log.psid = ?" : "";
    const params = req.params.psid ? [req.params.psid] : [];
    try {
      const [rows, _] = await query(
        `SELECT * FROM log INNER JOIN members ON log.psid = members.psid ${psidCondition} ORDER BY timestamp DESC`,
        params
      );
      handleResponse(res, rows, 200);
    } catch (err) {
      handleResponse(res, err, 500);
    }
  },
  postMembers: async (req, res) => {
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
  },
  getMembers: async (req, res) => {
    const psidCondition = req.params.psid ? "WHERE psid = ?" : "";
    const params = req.params.psid ? [req.params.psid] : [];
    try {
      const [rows, _] = await query(
        `SELECT * FROM members ${psidCondition}`,
        params
      );
      handleResponse(res, rows, 200);
    } catch (err) {
      handleResponse(res, err, 500);
    }
  },
};

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

const query = async (sql, params = null) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows, fields] = await connection.execute(sql, params || []);
    return [rows, fields];
  } finally {
    if (connection) connection.release(); // Release the connection back to the pool.
  }
};
