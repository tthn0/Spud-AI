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
 * @function parseLogs
 * @description Parses JSON from the API to format that's easier to work with on the client side.
 * @param {Obect[]} logs - An array containing logs from the database.
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
 * @function getLogs
 * @description Retrieves logs from the API.
 * @param {string} endpoint - The API endpoint to retrieve logs from.
 * @returns {Object[]} - An array containing logs from the database.
 */
const getLogs = async (endpoint) => {
  return await fetch(endpoint)
    .then((res) => res.json())
    .then(parseLogs);
};

document.addEventListener("DOMContentLoaded", async () => {
  const html = document.querySelector("html");
  const tbody = document.querySelector("tbody");
  const searchBar = document.querySelector("input");
  const selectOrder = document.getElementById("order");
  const selectColumn = document.getElementById("column");
  const exportButton = document.getElementById("export");

  // Get info from the data attributes on the html tag to determine which API endpoint to use
  const origin_url = html.getAttribute("data-origin-url");
  const testing = html.getAttribute("data-testing");
  const endpoint = `${origin_url}/api${
    testing === "true" ? "/testlogs" : "/logs"
  }`;

  /**
   * @function searchLogs
   * @description Returns a new filtered list of logs that have fields containing the given value
   * @param {Object[]} logs  - The array of logs to search through.
   * @param {string} searchString - The string to search for.
   * @returns {Object[]} - A new, filtered array of logs.
   */
  const searchLogs = (logs, searchString) => {
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
   * where order of 1 means ascending, -1 means descending.
   * @param {Object[]} logs  - The array of logs to sort.
   * @param {number} order - The order to sort by.
   * @param {string} column - The column to sort by.
   * @returns {Object[]} - A new, sorted array of logs.
   */
  const sortLogs = (logs, order, column) => {
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
   * @param {Object[]} logs  - The array of logs to sort and filter.
   * @returns {Object[]} - A new, sorted and filtered array of logs.
   */
  const sortedFilteredLogs = (logs) => {
    const order = selectOrder.value;
    const column = selectColumn.value;
    const searchString = searchBar.value;

    const sorted = sortLogs(logs, order, column); // Sort first to make filtering faster
    const filtered = searchLogs(sorted, searchString); // This is because searching is more expensive
    return filtered;
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
   * @function updateTable
   * @description Updates the table based on the current search bar and sort order values.
   * Called when the search bar or sort order selectors are changed.
   * @returns {void}
   */
  const updateTable = () => {
    buildTableBody(sortedFilteredLogs(logs), tbody);
    highlightTableData(searchBar.value);
  };

  // Retrieve the logs from the data attribute on the tbody
  let logs = await getLogs(endpoint);

  updateTable(); // Initialize the table for the first time
  searchBar.addEventListener("input", updateTable);
  selectOrder.addEventListener("change", updateTable);
  selectColumn.addEventListener("change", updateTable);

  // Listen for when the logs are updated
  io().on("logsUpdated", async () => {
    logs = await getLogs(endpoint);
    updateTable();
  });

  // Add a keyboard shortcut to focus the search bar
  document.addEventListener("keydown", (e) => {
    // Check if CMD/CTRL + F is pressed
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      const searchBar = document.querySelector("input");
      if (searchBar === document.activeElement) searchBar.blur();
      else searchBar.focus();
    }
  });

  // [Todo]
  tbody.addEventListener("click", ({ target }) => {
    if (target.classList.contains("fa-trash")) {
      // If the trash icon is clicked
      alert("This button doens't work yet, but it will be implemented soon.");
      const logId = target.getAttribute("data-id");
      // [Todo] Send a request to the server to delete the log with the given id
      // [Todo] Remove the row from the table by updating the `logs` variable and `buildTableBody()` again
    } else if (target.closest("tr")) {
      // [Todo] If a row is clicked (actually checks if any of the row's children were clicked)
      // Just here for a potential future enhancement
      // const psid = target.closest("tr").querySelector(".psid").textContent;
      // console.log(psid);
      // console.log(target.textContent);
    }
  });

  // Called when the export button is clicked
  exportButton.addEventListener("click", () => {
    // Convert the logs to a blob
    const jsonString = JSON.stringify(sortedFilteredLogs(logs), null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a download link
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "logs.json";

    // Add link, click it, and remove it from DOM
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });
});

/**
 * @function buildTableBody
 * @description Builds the table body by injecting rows into the given tbody.
 * @param {Object[]} logs - The array of logs to build the table body with.
 * @param {HTMLTableSectionElement} tbody - The tbody to inject rows into.
 * @returns {void}
 */
const buildTableBody = (logs, tbody) => {
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
          <div class="name">
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
        <i class="fa-solid fa-trash" data-id="${log.id}"></i>
      </td>
    `;
  };

  /**
   * @function clearTableBody
   * @description Clears the given table body.
   * @param {HTMLTableSectionElement} tbody - The tbody to clear.
   * @returns {void}
   */
  const clearTableBody = () => {
    const tbody = document.querySelector("tbody");
    while (tbody.childElementCount) tbody.removeChild(tbody.lastElementChild);
  };

  // Build in a fragment before injecting them into the DOM
  // This is more efficient than injecting each row individually
  const fragment = document.createDocumentFragment();
  logs.forEach((log) => {
    const row = document.createElement("tr");
    row.innerHTML = buildRow(log);
    fragment.appendChild(row);
  });

  clearTableBody();
  tbody.appendChild(fragment);

  const recordsElement = document.getElementById("records");
  recordsElement.textContent = `${logs.length} Records`;

  // Hacky way to make the table look more "balanced" when there are an even number of rows
  const numTableRows = document.querySelectorAll("tr").length;
  const tableContainer = document.querySelector("#outer-table-container");
  tableContainer.style.paddingBottom = numTableRows % 2 ? "0.5rem" : "0";
};
