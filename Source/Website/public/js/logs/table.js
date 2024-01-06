/* Include "// @ts-check" at the top of the file before making changes (to enable type
 * checking). This is intentionally left out because it causes errors when using DOM methods.
 */

/**
 * @function leftPadZeros
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
 * @function parseLogs
 * @description Parses JSON from the API to format that's easier to work with on the client side.
 * @param {Object[]} logs - An array containing logs from the database.
 * @returns {Object[]} - A new array containing parsed logs.
 */
const parseLogs = (logs) => {
  const DEFAULT_IMAGE_PATH = "./images/default-profile-picture.jpg";
  return logs.map((row) => {
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

/**
 * @function filterLogs
 * @description Returns a new filtered list of logs that have fields containing the given value
 * @param {Object[]} logs  - The array of logs to search through.
 * @param {string} searchString - The string to search for.
 * @returns {Object[]} - A new, filtered array of logs.
 */
const filterLogs = (logs, searchString) => {
  searchString = searchString.trim().toLowerCase();
  return logs.filter((item) => {
    return [
      "first",
      "last",
      "role",
      "psid",
      "email",
      "discord",
      "date",
      "time",
    ].some((key) => {
      const itemValue = String(item[key]).toLowerCase();
      return itemValue.includes(searchString);
    });
  });
};

/**
 * @function sortLogs
 * @description Returns a new sorted list of logs based on a sort order and column to sort by
 * @param {Object[]} logs  - The array of logs to sort.
 * @param {string} column - The column to sort by.
 * @param {string} order - The order to sort by; "1" means ascending, "-1" means descending.
 * @returns {Object[]} - A new, sorted array of logs.
 */
const sortLogs = (logs, column, order) => {
  const ascending = parseInt(order);
  return [...logs].sort((a, b) => {
    // Special case for the name column
    if (column === "name") {
      // Compare first names first
      const firstNameComparison = a.first.localeCompare(b.first);
      // If first names are the same, compare last names
      return firstNameComparison !== 0
        ? ascending
          ? firstNameComparison
          : -firstNameComparison
        : ascending
        ? a.last.localeCompare(b.last)
        : -a.last.localeCompare(b.last);
    }
    // For other columns, use the default comparison logic
    return ascending ? a[column] > b[column] : a[column] < b[column];
  });
};

/**
 * @function sortedFilteredLogs
 * @description Returns a new list of logs that have been sorted and filtered.
 * @param {Object} argumentBundle - An object containing the original logs along with HTML elements.
 * @returns {Object[]} - A new, sorted and filtered array of logs.
 */
const sortedFilteredLogs = ({ logs, searchBar, selectColumn, selectOrder }) => {
  const searchString = searchBar.value;
  const column = selectColumn.value;
  const order = selectOrder.value;
  const filtered = filterLogs(logs, searchString); // Filter first (O(n)) to make sorting faster
  return sortLogs(filtered, column, order); // Sort last (O(n log n)) since it's more expensive
};

/**
 * @function highlightTableData
 * @description Replaces all occurrences of the given text in the table a span with a background color,
 * so CSS can be applied to highlight the text.
 * @param {string} searchText - The text to highlight.
 * @returns {void}
 */
const highlightTableData = (searchText) => {
  if (searchText.trim()) {
    const searchables = document.querySelectorAll(".searchable");
    searchables.forEach((element) => {
      const cellText = element.textContent;
      const lowerCaseCellText = cellText.toLowerCase();
      const isMatch =
        lowerCaseCellText.indexOf(searchText.toLowerCase()) !== -1;
      if (isMatch) {
        // Use regular expression with the "gi" flag to match all occurrences
        // and replace them with the same text but wrapped in a span with a
        // background color. "g" means global and "i" means case insensitive.
        const regex = new RegExp(searchText, "gi");
        element.innerHTML = cellText.replace(
          regex,
          (match) => `<span class="highlighted">${match}</span>`
        );
      }
    });
  }
};

/**
 * @function buildRow
 * @description Builds a table row with the given log.
 * @param {Object} log - The log to build the row with.
 * @returns {string} - A raw HTML string for a table row.
 */
const buildRow = (log) => {
  return `
    <td>
      <div class="user-container">
        <div class="image-container">
          <img src="${log.image}" alt="Headshot" />
        </div>
        <div class="name-container">
          <div class="searchable first">${log.first}</div>
          <div class="searchable last">${log.last}</div>
        </div>
      </div>
    </td>
    <td>
      <span
        class="searchable role ${log.role.toLowerCase()}">${log.role}
      </span>
    </td>
    <td>
      <pre class="searchable psid">${log.psid}</pre>
    </td>
    <td class="searchable">${log.email}</td>
    <td class="searchable">${log.discord}</td>
    <td>
      <div class="searchable date">${log.date}</div>
      <div class="searchable time">${log.time}</div>
    </td>
    <td>
      <i class="fa-solid fa-trash" data-log-id="${log.id ?? ""}"></i>
    </td>
  `;
};

/**
 * @function buildTableBody
 * @description Builds the table body by injecting rows into the given tbody up to the provided limit.
 * @param {Object} argumentBundle - An object containing the original logs along with HTML elements.
 * @returns {void}
 */
const buildTableBody = (argumentBundle) => {
  const logs = sortedFilteredLogs(argumentBundle);
  const { tbody, logsLimit } = argumentBundle;

  // Build fragment before injecting them into the DOM
  // (More efficient than injecting each row individually)
  const fragment = document.createDocumentFragment();
  logs.slice(0, logsLimit.value).forEach((log) => {
    const row = document.createElement("tr");
    row.innerHTML = buildRow(log);
    fragment.appendChild(row);
  });

  // Clear the table body and inject the fragment
  tbody.innerHTML = "";
  tbody.appendChild(fragment);

  // Update the text that displays the total number of records
  const recordsElement = document.getElementById("records");
  recordsElement.textContent = `${logs.length} Records`;

  // Hacky way to make the table look more "balanced" when there are an even number of rows
  const numTableRows = document.querySelectorAll("tr").length;
  const tableContainer = document.querySelector("#outer-table-container");
  tableContainer.style.paddingBottom = numTableRows % 2 ? "0.5rem" : "0";
};

/**
 * @function updateTable
 * @description Updates the table based on the current search bar and sort order values.
 * @param {Object} argumentBundle - An object containing the original logs along with HTML elements.
 * @returns {void}
 */
const updateTable = (argumentBundle) => {
  buildTableBody(argumentBundle);
  highlightTableData(argumentBundle.searchBar.value);
};

/**
 * @function handleKeydownEvent
 * @description Handles the keydown event and adds a keyboard shortcut to focus the search bar.
 * @param {KeyboardEvent} event - The keydown event.
 * @returns {void}
 */
const handleKeydownEvent = (event) => {
  // If CMD/CTRL + F is pressed, toggle focus on the search bar
  if ((event.ctrlKey || event.metaKey) && event.key === "f") {
    event.preventDefault();
    const searchBar = document.querySelector("input");
    if (searchBar === document.activeElement) searchBar.blur();
    else searchBar.focus();
  }
};

/**
 * @function handleTrashClick
 * @description Ask for confirmation and delete log entry accordingly.
 * @param {MouseEvent} event - The click event.
 * @returns {Promise<void>} - A promise that resolves when the log is deleted.
 */
const handleTrashClick = async ({ target }) => {
  // If the trash icon wasn't clicked, do nothing
  const trashClicked = target.classList.contains("fa-trash");
  if (!trashClicked) return;

  // If the log is fake, do nothing
  const logId = target.getAttribute("data-log-id");
  if (!logId) {
    return alert(
      "This log can't be deleted since it's fake and was generated for testing purposes."
    );
  }

  // If the user doesn't confirm, do nothing
  const confirmed = window.confirm(
    "Are you sure you want to delete the this entry?"
  );
  if (!confirmed) return;

  // Apply fading out animation to the log
  const row = target.parentElement.parentElement;
  row.classList.add("fade-out");

  // Delete the appropriate log
  fetch(`${origin}/api/logs/${logId}`, {
    method: "DELETE",
  });
};

/**
 * @function handleExportClick
 * @description Exports the logs to a JSON file.
 * @param {Object} argumentBundle - An object containing the original logs along with HTML elements.
 * @returns {void}
 */
const handleExportClick = (argumentBundle) => {
  // Convert the logs to a blob
  const jsonString = JSON.stringify(
    sortedFilteredLogs(argumentBundle),
    null,
    2
  );
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a download link
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "logs.json";

  // Add link, click it, and remove it from DOM
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

/**
 * @function getLogs
 * @description Retrieves logs from the API.
 * @param {string} endpoint - The API endpoint to retrieve logs from.
 * @returns {Promise<Object[]>} - A promise that resolves to an array containing logs from the database.
 */
const getLogs = async (endpoint) => {
  return fetch(endpoint)
    .then((res) => res.json())
    .then(parseLogs);
};

/**
 * @function displayLogs
 * @description Displays the logs on the page.
 * @returns {Promise<void>} - A promise that resolves when the logs are displayed.
 */
const displayLogs = async () => {
  const html = document.querySelector("html");
  const tbody = document.querySelector("tbody");
  const searchBar = document.querySelector("input");
  const selectColumn = document.getElementById("sort-column");
  const selectOrder = document.getElementById("sort-order");
  const exportButton = document.getElementById("export");
  const logsLimit = document.getElementById("logs-limit");

  // Get info from the data attributes on the html tag to determine which API endpoint to use
  const testing = html.getAttribute("data-testing");
  const logsEndpoint = `${origin}/api${
    testing === "true" ? "/testlogs" : "/logs"
  }`;

  // Retrieve logs for the first time
  let logs = await getLogs(logsEndpoint);

  const argumentBundle = {
    logs,
    tbody,
    searchBar,
    selectColumn,
    selectOrder,
    logsLimit,
  };

  // Update the table for the first time
  updateTable(argumentBundle);

  // Update the table when the query changes
  searchBar.addEventListener("input", () => updateTable(argumentBundle));
  selectColumn.addEventListener("change", () => updateTable(argumentBundle));
  selectOrder.addEventListener("change", () => updateTable(argumentBundle));
  logsLimit.addEventListener("change", () => updateTable(argumentBundle));

  // Listen for when the logs are updated through the socket and update the table accordingly
  // @ts-ignore
  io().on("logsUpdated", async () => {
    argumentBundle.logs = await getLogs(logsEndpoint);
    updateTable(argumentBundle);
  });

  // Add a keyboard shortcut to focus the search bar
  document.addEventListener("keydown", handleKeydownEvent);

  // When the trash icon is clicked
  tbody.addEventListener("click", (e) => handleTrashClick(e));

  // When the export button is clicked
  exportButton.addEventListener("click", () =>
    handleExportClick(argumentBundle)
  );
};

document.addEventListener("DOMContentLoaded", displayLogs);
