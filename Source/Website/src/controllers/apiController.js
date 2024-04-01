// @ts-check

const express = require("express"); // For type checking
const mysql = require("mysql2/promise");
const { join } = require("path");
const { io } = require(join(__dirname, "..", "..", "app"));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

module.exports = {
  /**
   * @function getUsers
   * @description Gets a list of users from the database.
   * @param {express.Request} _ - Placeholder for the request object.
   * @param {express.Response} res - The response object.
   * @param {boolean} [testing=false] - Whether or not to generate fake users (for testing purposes).
   */
  getUsers: async (_, res, testing = false) => {
    try {
      let users;
      if (testing) users = await generateTestUsers();
      else users = await query(`SELECT * FROM users`);
      handleResponse(res, users, 200);
    } catch (err) {
      handleResponse(res, err, 500);
    }
  },

  /**
   * @function postUsers
   * @description Adds a user to the database.
   * @param {express.Request} req - The request object.
   * @param {express.Response} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  postUsers: async (req, res) => {
    const { email, first, last, discord } = req.body;
    try {
      // @ts-ignore
      const { insertId: userId } = await query(
        "INSERT INTO users (email, first, last, discord) VALUES (?, ?, ?, ?)",
        [email, first, last, discord]
      );
      handleResponse(
        res,
        `Registration successful. New User ID: ${userId}.`,
        200
      );
    } catch (err) {
      handleResponse(res, err, 500);
    }
  },

  /**
   * @function getLogs
   * @description Gets a list of logs from the database.
   * @param {express.Request} _ - Placeholder for the request object.
   * @param {express.Response} res - The response object.
   * @param {boolean} [testing=false] - Whether or not to generate fake logs (for testing purposes).
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  getLogs: async (_, res, testing = false) => {
    try {
      let logs;
      if (testing) {
        logs = await generateTestLogs();
      } else {
        logs = await query("SELECT * FROM logs_view");
      }
      handleResponse(res, logs, 200);
    } catch (err) {
      handleResponse(res, err, 500);
    }
  },

  /**
   * @function postLogs
   * @description Adds a log to the database.
   * @param {express.Request} req - The request object.
   * @param {express.Response} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  postLogs: async (req, res) => {
    try {
      await query("INSERT INTO logs (user_id, timestamp) VALUES (?, ?)", [
        req.params.userId,
        Date.now(),
      ]);
      io.emit("logsUpdated");
      handleResponse(res, `Logged user with ID ${req.params.userId}.`, 200);
    } catch (err) {
      handleResponse(res, err, 500);
    }
  },

  /**
   * @function deleteLogs
   * @description Deletes a log from the database.
   * @param {express.Request} req - The request object.
   * @param {express.Response} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  deleteLogs: async (req, res) => {
    try {
      await query("DELETE FROM logs WHERE id = ?", [req.params.logId]);
      io.emit("logsUpdated");
      handleResponse(res, `Deleted log entry ${req.params.logId}.`, 200);
    } catch (err) {
      handleResponse(res, err, 500);
    }
  },
};

/**
 * @function handleResponse
 * @description Handles a response from the server, depending on the data and status code.
 * @param {express.Response} res - The response object.
 * @param {Object} data - The data to handle.
 * @param {number} [status=200] - The status code to send.
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
 * @typedef {mysql.OkPacket | mysql.RowDataPacket[] | mysql.ResultSetHeader[] | mysql.RowDataPacket[][] | mysql.OkPacket[] | mysql.ProcedureCallPacket} QueryResult
 * @description Contains the result of a SQL query (used for type checking).
 */

/**
 * @function query
 * @description Executes a SQL query.
 * @param {String} sql - SQL query to execute.
 * @param {any[] | null} [params=[]] - Parameters to pass into the SQL query.
 * @returns {Promise<QueryResult>} - A promise that resolves to the result of the SQL operation.
 */
const query = async (sql, params = []) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.query(sql, params);
    return result;
  } finally {
    if (connection) connection.release(); // Release connection back to the pool.
  }
};

/**
 * @function generateTestUsers
 * @description Generates a list of real users from the database and appends fake users.
 * @param {number} count - The number of fake uers to generate after the real users.
 * @returns {Promise<Object[]>} - A promise that resolves to the new array containing real users with appended fake users.
 */
const generateTestUsers = async (count = 100) => {
  /**
   * @function weightedRandomSelection
   * @description Selects a random value from an array of objects based on their respective weight probabilities.
   * @param {Object[]} options - The array of objects to select from that contains a `value` and `weight` property.
   * @returns {Object} - The randomly selected object.
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

  /**
   * @function getRandomInteger
   * @description Returns a random integer between the specified range (inclusive).
   * @param {number} min - The minimum value.
   * @param {number} max - The maximum value.
   * @returns {number} - The random integer.
   */
  const getRandomInteger = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const randomUserAPI = `https://randomuser.me/api?inc=name,email,login,id,picture&results=${count}`;
  const [realUsers, fakeUsers] = await Promise.all([
    fetch(`${global.ORIGIN_URL}/api/users`).then((res) => res.json()),
    fetch(randomUserAPI)
      .then((res) => res.json())
      .then((json) => json.results),
  ]);

  const roles = [
    { value: "Guest", weight: 10 },
    { value: "Non-Member", weight: 5 },
    { value: "Member", weight: 3 },
    { value: "Officer", weight: 1 },
  ];

  return [
    ...realUsers,
    ...fakeUsers.map((user) => {
      // Remove the domain and replace with their last name dot com
      user.email = user.email.split("@")[0];
      user.email = user.email.replace(".", "@");
      user.email += ".com";
      return {
        id: getRandomInteger(1000, 99999), // Random 4 or 5 digit number
        role: weightedRandomSelection(roles),
        email: user.email,
        first: user.name.first,
        last: user.name.last,
        discord: user.login.username,
        image: user.picture.medium,
      };
    }),
  ];
};

/**
 * @function generateTestLogs
 * @description
 * Generates a list of real logs from the database and appends fake logs. Fake logs may be generated from
 * real users or fake users. The timestamp of the fake logs will be randomized but are guaranteed to be
 * older than the oldest real timestamp. The maximum count of a single user will appear as many times as
 * `maxFreq`. The minimum count of a single user will appear as many times as `maxFreq // 2`. All intermediate
 * frequencies will be interpolated to follow a quadratic curve with `maxFreq` as the vertex and `maxFreq // 2`
 * as the minimum frequency.
 * @param {number} maxFreq - The maximum frequency of a single user in the fake data that will be generated.
 * @returns {Promise<Object[]>} - A promise that resolves to the new array containing fake data.
 */
const generateTestLogs = async (maxFreq = 10) => {
  /**
   * @function newArrayFromFrequencies
   * @description Returns a new array with objects duplicated according to their respective frequencies.
   * @param {Object[]} objects - The array of objects to duplicate.
   * @param {number[]} frequencies - The array of frequencies indicating how many times each object should be duplicated.
   * @throws {RangeError} - If the lengths of the `objects` and `frequencies` arrays aren't equal or if any frequency is negative.
   * @returns {Object[]} - A new array containing duplicated objects based on the provided frequencies.
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
        .fill(undefined)
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

  /**
   * @function renameField
   * @description Returns a new array containing the objects with the specified field renamed.
   * @param {Object[]} objects - The array of objects to rename a field for.
   * @param {string} oldKey - The old field key name.
   * @param {string} newKey - The new field key name.
   * @returns {Object[]} - A new array containing the renamed objects.
   */
  const renameField = (objects, oldKey, newKey) => {
    return objects.map(({ [oldKey]: oldValue, ...rest }) => ({
      [newKey]: oldValue,
      ...rest,
    }));
  };

  // Gather data concurrently
  const combinedData = await Promise.all([
    fetch(`${global.ORIGIN_URL}/api/testusers`).then((res) => res.json()),
    fetch(`${global.ORIGIN_URL}/api/logs`).then((res) => res.json()),
  ]);
  let testUsers = combinedData[0];
  const realLogs = combinedData[1];

  // Rename `id` to `user_id` for fake logs (to match the real logs and for consistency)
  testUsers = renameField(testUsers, "id", "user_id");

  // Shuffle test users
  testUsers.sort(() => Math.random() - 0.5);

  // Generate a list of frequencies for each user
  const frequencies = frequencyArrayGenerator(testUsers.length);

  // Repeat each user according to their frequency
  const fakeLogs = newArrayFromFrequencies(testUsers, frequencies);

  // Randomize the timestamps such that they are older than the oldest real timestamp
  const fakeLogsTimestamped = fakeLogs.map((log) => {
    const baseTimestamp = realLogs[realLogs.length - 1].timestamp;
    log.timestamp = randomizedTimestamp(baseTimestamp);
    return log;
  });

  // Sort the logs by timestamp in descending order
  const fakeLogsSorted = fakeLogsTimestamped.sort(
    (a, b) => b.timestamp - a.timestamp
  );

  // Return combined logs
  return [...realLogs, ...fakeLogsSorted];
};
