module.exports = {
  getIndex: async (req, res) => {
    res.send("[Load landing page here]");
  },
  getRegister: async (req, res) => {
    res.render("register");
  },
  getLogs: async (req, res) => {
    try {
      const response = await fetch(`${global.SOCKET}/api/logs`);
      const logs = await response.json();
      res.render("logs", { logs: parseJson(logs) });

      // // ---------- TESTING PURPOSES ONLY ---------- //
      // res.render("logs", {
      //   logs: parseJson([...logs, ...(await generateFakeData(logs))]),
      // });
      // // ---------- TESTING PURPOSES ONLY ---------- //
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
};

/**
 * @function padWithZero
 * @description Pads a number with a leading zero if it's less than 10.
 * @param {*} number - The number to pad.
 * @returns {string} - The padded number.
 */
const padWithZero = (number) => {
  return number < 10 ? `0${number}` : number;
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
  const day = padWithZero(date.getDate());
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
  const minutes = padWithZero(date.getMinutes());
  const ampm = hours >= 12 ? "pm" : "am";
  const hour = hours % 12 || 12;
  return `${hour}:${minutes} ${ampm}`;
};

/**
 * @function parseJson
 * @description Parses JSON from the API to format that's easier to work with on the client side.
 * @param {Obect[]} logs - An array containing logs from the database.
 * @returns {Object[]} - The new array containing parsed logs.
 */
const parseJson = (logs) => {
  const DEFAULT_AVATAR =
    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";
  return logs.map((row) => {
    return {
      id: row.id,
      avatar: row.image || DEFAULT_AVATAR,
      first: row.first,
      last: row.last,
      role: row.role,
      psid: row.psid,
      email: row.email,
      timestamp: row.timestamp,
      date: convertDate(row.timestamp),
      time: convertTime(row.timestamp),
    };
  });
};

/**
 * @function generateFakeData
 * @description
 * Generates a list of fake data based on actual registered members in the database but with random timestamps
 * that are guaranteed to be older than the oldest real timestamp (for testing purposes). The count of a single
 * member generated from this function will appear as many times as `maxFreq`. The count of a single member with
 * the lowest frequency will appear as many times as `maxFreq // 2`. All intermediate frequencies will be
 * interpolated to follow a quadratic curve with `maxFreq` as the vertex and `maxFreq // 2` as the minimum frequency.
 * @param {Object[]} realLogs - The actual JSON data from the database.
 * @param {number} maxFreq - The maximum frequency of a single member in the fake data that will be generated.
 * @returns {Object[]} The new array containing fake data.
 */
const generateFakeData = async (realLogs, maxFreq = 50) => {
  /**
   * @function newArrayFromFrequencies
   * @description Returns a new array with objects duplicated according to their respective frequencies.
   * @param {Object[]} objects - The array of objects to duplicate.
   * @param {number[]} frequencies - The array of frequencies indicating how many times each object should be duplicated.
   * @returns {Object[]} - A new array containing duplicated objects based on the provided frequencies.
   * @throws {RangeError} - If the lengths of the `objects` and `frequencies` arrays aren't equal.
   * @throws {RangeError} - If any frequency is negative.
   */
  const newArrayFromFrequencies = (objects, frequencies) => {
    if (objects.length !== frequencies.length)
      throw new RangeError(
        "Lengths of `objects` and `frequencies` must be equal."
      );
    if (frequencies.some((freq) => freq < 0))
      throw new RangeError("Frequencies must be positive.");
    return objects.flatMap((object, i) =>
      Array(frequencies[i])
        .fill()
        .map(() => ({ ...object }))
    );
  };

  /**
   * @function frequencyArrayGenerator
   * @description Generates an array of frequencies with the specified length.
   * This uses a "magic" formula that I came up with to generate a good distribution of frequencies.
   * @param {number} length - The length of the array to be generated.
   * @returns {number[]} - The array of frequencies.
   */
  const frequencyArrayGenerator = (length) => {
    const s = Math.floor(length / 2);
    return Array.from({ length }).map((_, i) =>
      Math.floor(maxFreq * (1 - (i - s) ** 2 / (2 * s ** 2)))
    );
  };

  /**
   * @function randomizeTimestamp
   * @description Generates a randomized timestamp guarenteed to be older than the given base timestamp throughout an interval of 1 year.
   * @param {number} baseTimestamp - The base timestamp (in milliseconds) to generate a random timestamp before.
   * @param {number} days - The minimum number of days the randomized timestamp may be older than the base timestamp.
   * @returns {number} - The randomized timestamp.
   */
  const randomizedTimestamp = (baseTimestamp, days) => {
    const dayInMs = 60 * 60 * 24 * 1000;
    const yearInMs = dayInMs * 365;
    const randomInterval = Math.floor(Math.random() * yearInMs);
    return baseTimestamp - days * dayInMs - randomInterval;
  };

  // Obtain all registered members from the database
  const response = await fetch(`${global.SOCKET}/api/members`);
  const members = await response.json();

  // Shuffle the real json data
  members.sort(() => Math.random() - 0.5);

  // Generate a list of frequencies for each member
  const frequencies = frequencyArrayGenerator(members.length);

  // Repeat the real data according to the generated frequencies
  const repeated = newArrayFromFrequencies(members, frequencies);

  // Randomize the timestamps and return the new array
  return repeated.map((log) => {
    const baseTimestamp = realLogs[realLogs.length - 1].timestamp;
    log.timestamp = randomizedTimestamp(baseTimestamp, 7);
    return log;
  });
};
