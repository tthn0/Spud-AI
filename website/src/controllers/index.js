module.exports = {
  getIndex: async (req, res) => {
    res.send("[Load landing page here]");
  },
  getRegister: async (req, res) => {
    res.render("register");
  },
  getLog: async (req, res) => {
    const psidCondition = req.params.psid ? `/${req.params.psid}` : "";
    try {
      const response = await fetch(
        `http://localhost:${process.env.PORT || 8000}/api/log${psidCondition}`
      );
      const json = await response.json();
      const tableRows = buildTableRows(json);
      res.render("log", { tableRows });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
};

const padWithZero = (value) => (value < 10 ? `0${value}` : value);

const dateFormater = (timestamp) => {
  const date = new Date(timestamp);
  const [year, month, day, hours, minutes] = [
    date.getFullYear(),
    padWithZero(date.getMonth() + 1),
    padWithZero(date.getDate()),
    padWithZero(date.getHours()),
    padWithZero(date.getMinutes()),
  ];
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const buildTableRows = (data) => {
  return data
    .map((row) => {
      return `<tr>
        <td><input type="checkbox" value="${row.psid}" /></td>
        <td>${dateFormater(row.timestamp)}</td>
        <td>
          <strong>${row.first} ${row.last}</strong>
          <br />
          <span id=psid>${row.psid}</span>
        </td>
        <td>
          <span class="role ${row.role.toLowerCase()}">${row.role}</span>
        </td>
        <td>${row.email}</td>
        <td>${row.discord}</td>
      </tr>`;
    })
    .join("");
};
