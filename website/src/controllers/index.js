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
      res.render("log", { logs: parseJson(json) });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
};

const padWithZero = (number) => {
  return number < 10 ? `0${number}` : number;
};

const convertDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "short" });
  const day = padWithZero(date.getDate());
  return `${day} ${month} ${year}`;
};

const convertTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = padWithZero(date.getMinutes());
  const ampm = hours >= 12 ? "pm" : "am";
  const hour = hours % 12 || 12;
  return `${hour}:${minutes} ${ampm}`;
};

const parseJson = (json) => {
  return json.map((row) => {
    return {
      id: row.id,
      avatar:
        row.image ||
        "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
      first: row.first,
      last: row.last,
      role: row.role,
      psid: row.psid,
      email: row.email,
      date: convertDate(row.timestamp),
      time: convertTime(row.timestamp),
    };
  });
};
