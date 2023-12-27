const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("[Load landing page here]");
});

router.get("/register", (req, res) => {
  res.render("register");
});

function buildTableRows(data) {
  return data
    .map((row) => {
      return `<tr>
        <td><input type="checkbox" /></td>
        <td>${row.timestamp}</td>
        <td>
          <strong>${row.first} ${row.last}</strong>
          <br />
          <span id=psid>${row.psid}</span>
        </td>
        <td>${row.role}</td>
        <td>${row.email}</td>
        <td>${row.discord}</td>
      </tr>`;
    })
    .join("");
}

router.get("/log", async (req, res) => {
  let json;
  try {
    const response = await fetch(
      `http://localhost:${process.env.PORT || 8000}/api/log${
        req.query.psid ? `?psid=${req.query.psid}` : ""
      }`
    );
    json = await response.json();
  } catch (error) {
    console.log(error.response.body);
  }

  const tableRows = buildTableRows(json);

  res.render("log", { tableRows });
});

module.exports = router;
