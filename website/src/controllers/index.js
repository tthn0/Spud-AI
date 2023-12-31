module.exports = {
  getIndex: async (_, res) => {
    res.send("[Load landing page here]");
  },
  getRegister: async (_, res) => {
    res.render("register");
  },
  getLogs: async (req, res, testing = false) => {
    try {
      const endpoint = testing ? "/testlogs" : "/logs";
      const response = await fetch(`${global.SOCKET}/api${endpoint}`);
      const logs = await response.json();
      res.render("logs", { logs: parseJson(logs) });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
};

/**
 * @function padWithZeros
 * @description Pads a number with leading zeros to be `length` digits long.
 * @param {string|number} number - The number to pad.
 * @param {number} length - The length of the resulting string.
 * @returns {string} - The padded number.
 * @throws {RangeError} - If `length` is negative.
 */
const leftPadZeros = (number, length) => {
  if (length < 0) throw new RangeError("Length must be positive.");
  const numberString = number.toString();
  return numberString.length < length
    ? "0".repeat(length - numberString.length) + numberString
    : numberString;
};

/**
 * @function convertDate
 * @description Converts a timestamp to a date string in the format of "DD MMM YYYY".
 * @param {number} timestamp - The timestamp in milliseconds.
 * @returns {string} - A formatted time.
 */
const convertDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  return `${day} ${month} ${year}`;
};

/**
 * @function convertTime
 * @description Converts a timestamp to a time string in the format of "HH:MM am/pm".
 * @param {number} timestamp - The timestamp in milliseconds.
 * @returns {string} - A formatted time.
 */
const convertTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = leftPadZeros(date.getMinutes(), 2);
  const ampm = hours >= 12 ? "pm" : "am";
  const hour = hours % 12 || 12;
  return `${hour}:${minutes} ${ampm}`;
};

/**
 * @function parseJson
 * @description Parses JSON from the API to format that's easier to work with on the client side.
 * @param {Obect[]} logs - An array containing logs from the database.
 * @returns {Object[]} - A new array containing parsed logs.
 */
const parseJson = (logs) => {
  const DEFAULT_IMAGE_PATH = "./images/default-profile-picture.jpeg";
  // const RANDOM_FACE_URL = "https://thispersondoesnotexist.com";
  return logs.map((row, index) => {
    return {
      // Columns from `logs` table
      id: row.id,
      psid: leftPadZeros(row.psid, 7), // PSID's are 7 digits long
      timestamp: row.timestamp,

      // Columns from `members` table
      role: row.role,
      email: row.email,
      first: row.first,
      last: row.last,
      discord: row.discord,
      image: row.image || DEFAULT_IMAGE_PATH,

      // Formatted columns
      date: convertDate(row.timestamp),
      time: convertTime(row.timestamp),
    };
  });
};
