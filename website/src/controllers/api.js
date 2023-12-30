const mysql = require("mysql2/promise");
const creds = require("../../config/creds.json");
const pool = mysql.createPool(creds);

module.exports = {
  getLogs: async (req, res) => {
    const psidCondition = req.params.psid ? "WHERE logs.psid = ?" : "";
    const params = req.params.psid ? [req.params.psid] : [];
    try {
      const [rows, _] = await query(
        `SELECT * FROM logs INNER JOIN members ON logs.psid = members.psid ${psidCondition} ORDER BY timestamp DESC`,
        params
      );
      handleResponse(res, rows, 200);
    } catch (err) {
      handleResponse(res, err, 500);
    }
  },
  postLogs: async (req, res) => {
    try {
      await query("INSERT INTO logs (psid, timestamp) VALUES (?, ?)", [
        req.body.psid,
        Date.now(),
      ]);
      handleResponse(res, `Logged PSID ${req.body.psid}`, 200);
    } catch (err) {
      handleResponse(res, err, 500);
    }
  },
  deleteLogs: async (req, res) => {
    try {
      await query("DELETE FROM logs WHERE id = ?", [req.params.id]);
      handleResponse(res, `Deleted log entry ${req.params.id}`, 200);
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
};

/**
 *
 * @param {express.express.Response} - res The response object.
 * @param {Object} data - The data to handle.
 * @param {number} status - The status code to send.
 */
const handleResponse = (res, data, status = 200) => {
  // If data is an Error object, make the `message` and `stack` properties visible.
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

/**
 * @function query
 * @description Executes a SQL query.
 * @param {String} sql - SQL query to execute.
 * @param {Object[]} params - Parameters to pass into the SQL query.
 * @returns {Promise<[Object[], Object[]]>} - A promise that resolves to an array of rows and fields.
 */
const query = async (sql, params = null) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows, fields] = await connection.execute(sql, params || []);
    return [rows, fields];
  } finally {
    if (connection) connection.release(); // Release connection back to the pool.
  }
};
