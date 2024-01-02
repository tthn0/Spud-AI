const mysql = require("mysql2/promise");
const creds = require("../../config/creds.json");
const io = require("../../app");

const pool = mysql.createPool(creds);

module.exports = {
  getMembers: async (req, res, testing = false) => {
    try {
      let members;
      if (testing) {
        members = await generateTestMembers();
      } else {
        const psidCondition = req.params.psid ? "WHERE psid = ?" : "";
        const params = req.params.psid ? [req.params.psid] : [];
        const [rows, _] = await query(
          `SELECT * FROM members ${psidCondition}`,
          params
        );
        members = rows;
      }
      handleResponse(res, members, 200);
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
  getLogs: async (req, res, testing = false) => {
    try {
      let logs;
      if (testing) {
        logs = await generateTestLogs();
      } else {
        const psidCondition = req.params.psid ? "WHERE logs.psid = ?" : "";
        const params = req.params.psid ? [req.params.psid] : [];
        const [rows, _] = await query(
          `SELECT * FROM logs INNER JOIN members ON logs.psid = members.psid ${psidCondition} ORDER BY timestamp DESC`,
          params
        );
        logs = rows;
      }
      handleResponse(res, logs, 200);
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
      io.emit("logsUpdated");
      handleResponse(res, `Logged PSID ${req.body.psid}`, 200);
    } catch (err) {
      handleResponse(res, err, 500);
    }
  },
  deleteLogs: async (req, res) => {
    try {
      await query("DELETE FROM logs WHERE id = ?", [req.params.id]);
      io.emit("logsUpdated");
      handleResponse(res, `Deleted log entry ${req.params.id}`, 200);
    } catch (err) {
      handleResponse(res, err, 500);
    }
  },
};

/**
 * @function handleResponse
 * @description Handles a response from the server, depending on the data and status code.
 * @param {express.Response} - res The response object.
 * @param {Object} data - The data to handle.
 * @param {number} status - The status code to send.
 * @returns {void}
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
    const [rows, fields] = await connection.execute(sql, params ?? []);
    return [rows, fields];
  } finally {
    if (connection) connection.release(); // Release connection back to the pool.
  }
};

/**
 * @function generateTestMembers
 * @description Generates a list of real members from the database and appends fake members.
 * @param {number} count - The number of fake members to generate after the real members.
 * @returns {Object[]} - A new array containing real members with appended fake members.
 */
const generateTestMembers = async (count = 100) => {
  /**
   * @function weightedRandomSelection
   * @description Selects a random value from an array of objects based on their respective weight probabilities.
   * @param {Object[]} options - The array of objects to select from that contains a `value` and `weight` property.
   * @returns {Object} - The randomly selected object.
   * @throws {Error} -
   */
  const weightedRandomSelection = (options) => {
    const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);
    let randomNumber = Math.random() * totalWeight;
    for (const option of options) {
      if (randomNumber < option.weight) return option.value;
      randomNumber -= option.weight;
    }
    return null; // Should never reach but happens when the sum of all weights is <= 0
  };

  const randomUserAPI = `https://randomuser.me/api?inc=name,email,login,id,picture&results=${count}`;
  const [realMembers, fakeMembers] = await Promise.all([
    fetch(`${global.ORIGIN_URL}/api/members`).then((res) => res.json()),
    fetch(randomUserAPI)
      .then((res) => res.json())
      .then((res) => res.results),
  ]);

  const roles = [
    { value: "Guest", weight: 10 },
    { value: "Non-Member", weight: 5 },
    { value: "Member", weight: 3 },
    { value: "Officer", weight: 1 },
  ];

  return [
    ...realMembers,
    ...fakeMembers.map((member) => {
      // Remove the domain and replace with their last name dot com
      member.email = member.email.split("@")[0];
      member.email = member.email.replace(".", "@");
      member.email += ".com";
      return {
        psid: Math.floor(Math.random() * 10 ** 7),
        role: weightedRandomSelection(roles),
        email: member.email,
        password: member.login.password,
        first: member.name.first,
        last: member.name.last,
        discord: member.login.username,
        image: member.picture.thumbnail,
      };
    }),
  ];
};

/**
 * @function generateTestLogs
 * @description
 * Generates a list of real logs from the database and appends fake logs. Fake logs may be generated from
 * real members or fake members. The timestamp of the fake logs will be randomized but are guaranteed to be
 * older than the oldest real timestamp.
 *
 * TODO: FIX THIS PART:
 *
 * The count of a single
 * member generated from this function will appear as many times as `maxFreq`. The count of a single member with
 * the lowest frequency will appear as many times as `maxFreq // 2`. All intermediate frequencies will be
 * interpolated to follow a quadratic curve with `maxFreq` as the vertex and `maxFreq // 2` as the minimum frequency.
 * @param {number} maxFreq - The maximum frequency of a single member in the fake data that will be generated.
 * @returns {Object[]} - The new array containing fake data.
 */
const generateTestLogs = async (maxFreq = 5) => {
  /**
   * @function newArrayFromFrequencies
   * @description Returns a new array with objects duplicated according to their respective frequencies.
   * @param {Object[]} objects - The array of objects to duplicate.
   * @param {number[]} frequencies - The array of frequencies indicating how many times each object should be duplicated.
   * @returns {Object[]} - A new array containing duplicated objects based on the provided frequencies.
   * @throws {RangeError} - If the lengths of the `objects` and `frequencies` arrays aren't equal.
   * @throws {RangeError} - If any frequency is negative.
   * @returns {Object[]} - A new array containing fake data.
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
  const randomizedTimestamp = (baseTimestamp, days = 1) => {
    const dayInMs = 60 * 60 * 24 * 1000;
    const yearInMs = dayInMs * 365;
    const randomInterval = Math.floor(Math.random() * yearInMs);
    return baseTimestamp - days * dayInMs - randomInterval;
  };

  // Gather data asynchronously
  const combinedData = await Promise.all([
    fetch(`${global.ORIGIN_URL}/api/testmembers`).then((res) => res.json()),
    fetch(`${global.ORIGIN_URL}/api/logs`).then((res) => res.json()),
  ]);

  // Retrieve test members from the combined data
  let testMembers = combinedData[0];

  // Shuffle test members
  testMembers.sort(() => Math.random() - 0.5);

  // Generate a list of frequencies for each member
  const frequencies = frequencyArrayGenerator(testMembers.length);

  // Repeat each member according to their frequency
  const repeated = newArrayFromFrequencies(testMembers, frequencies);

  // Randomize the timestamps such that they are older than the oldest real timestamp
  const realLogs = await fetch(`${global.ORIGIN_URL}/api/logs`).then((res) =>
    res.json()
  );
  const randomizedTimestamped = repeated.map((log) => {
    const baseTimestamp = realLogs[realLogs.length - 1].timestamp;
    log.timestamp = randomizedTimestamp(baseTimestamp);
    return log;
  });

  // Sort the logs by timestamp in descending order
  randomizedTimestamped.sort((a, b) => b.timestamp - a.timestamp);

  // Return combined logs
  return [...realLogs, ...randomizedTimestamped];
};
