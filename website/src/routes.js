const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

const creds = require("../config/creds.json");
const pool = mysql.createPool(creds);

const handleResponse = (res, message, status = 200) => {
  res.status(status).json({ Info: message });
};

router.get("/", (req, res) => {
  res.send("[Load landing page here]");
});

router.get("/register", (req, res) => {
  res.render("register");
});

// router.get("/members", async (req, res) => {
//   const id = req.query.id;
//   let members;

//   try {
//     if (id) {
//       var sql = "SELECT * FROM members WHERE id = ?";
//       var [rows, fields] = await pool.execute(sql, [id]);
//     } else {
//       var sql = "SELECT * FROM members";
//       var [rows, fields] = await pool.execute(sql, []);
//     }

//     console.log(rows);

//     if (rows.length > 0) {
//       members = rows
//         .map((row) => {
//           return `<div>
//             <p><strong>ID</strong>: ${row.id}</p>
//             <p><strong>PSID</strong>: ${row.psid}</p>
//             <p><strong>Email</strong>: ${row.email}</p>
//             <p><strong>First</strong>: ${row.first}</p>
//             <p><strong>Last</strong>: ${row.last}</p>
//             <p><strong>Discord</strong>: ${row.discord}</p>
//           </div>`;
//         })
//         .join("");
//     }
//   } catch (err) {
//     return res.status(500).send("Error: " + err.message);
//   }

//   res.render("members", { members });
// });

module.exports = router;
