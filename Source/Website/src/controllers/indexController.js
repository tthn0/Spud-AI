// @ts-check

const express = require("express"); // For type checking

module.exports = {
  /**
   * @function renderIndex
   * @description Renders the index page.
   * @param {express.Request} _ - Placeholder for the unused `Request` parameter.
   * @param {express.Response} res - Express `Response` object.
   * @returns {Promise<void>} - Promise object represents the response.
   */
  renderIndex: async (_, res) => {
    res.render("index");
  },

  /**
   * @function renderRegister
   * @description Renders the register page.
   * @param {express.Request} _ - Placeholder for the unused `Request` parameter.
   * @param {express.Response} res - Express `Response` object.
   * @returns {Promise<void>} - Promise object represents the response.
   */
  renderRegister: async (_, res) => {
    res.render("register");
  },

  /**
   * @function renderLogs
   * @description Renders the logs page.
   * @param {express.Request} _ - Placeholder for the unused `Request` parameter.
   * @param {express.Response} res - Express `Response` object.
   * @param {boolean} [testing=false] - Optional testing parameter.
   * @returns {Promise<void>} - Promise object represents the response.
   */
  renderLogs: async (_, res, testing = false) => {
    res.render("logs", { testing });
  },
};
