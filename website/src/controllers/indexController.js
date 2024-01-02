module.exports = {
  renderIndex: async (_, res) => {
    res.send("[Load landing page here]");
  },
  renderRegister: async (_, res) => {
    res.render("register");
  },
  renderLogs: async (_, res, testing = false) => {
    res.render("logs", {
      testing,
      originUrl: global.ORIGIN_URL,
    });
  },
};
