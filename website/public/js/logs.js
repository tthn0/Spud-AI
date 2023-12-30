// (Called after the table is built)
document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("tbody");
  const searchBar = document.querySelector("input");
  const selectOrder = document.getElementById("order");
  const selectColumn = document.getElementById("column");
  const exportButton = document.getElementById("export");

  // Returns a new filtered list of logs that have fields containing the given value
  const searchLogs = (logs, value) =>
    logs.filter((item) => {
      const lowercaseValue = value.toLowerCase();
      return ["first", "last", "role", "psid", "email", "date", "time"].some(
        (key) => {
          const itemValue = String(item[key]).toLowerCase();
          return itemValue.includes(lowercaseValue);
        }
      );
    });

  // Returns a new sorted list of logs based on a sort order and column to sort by
  const sortLogs = (logs, order, column) =>
    [...logs].sort((a, b) =>
      order === "ascending" ? a[column] > b[column] : a[column] < b[column]
    );

  // Returns a new list of logs that have been sorted and filtered
  const sortedFilteredLogs = () => {
    const order = selectOrder.value;
    const column = selectColumn.value;
    const searchString = searchBar.value;

    const logCopy = [...logs];
    const sorted = sortLogs(logCopy, order, column); // Sort first to make filtering faster
    const filtered = searchLogs(sorted, searchString); // This is because searching is more expensive
    return filtered;
  };

  // Called when the search bar or sort order selectors are changed
  const updateTable = () => {
    buildTableBody(sortedFilteredLogs(), tbody);
  };

  // Retrieve the logs from the data attribute on the tbody
  const logs = JSON.parse(tbody.getAttribute("data-logs"));

  // Initialize the table for the first time
  updateTable();

  searchBar.addEventListener("keyup", updateTable);
  selectOrder.addEventListener("change", updateTable);
  selectColumn.addEventListener("change", updateTable);

  // [Todo] Called when the trash icon is clicked
  tbody.addEventListener("click", ({ target }) => {
    // Check if the trash icon was clicked instead of the entire table body
    if (target.classList.contains("fa-trash")) {
      const logId = target.getAttribute("data-id");
      alert("This button doens't work yet, but it will be implemented soon.");
      // [Todo] Send a request to the server to delete the log with the given id
      // [Todo] Remove the row from the table by updating the `logs` variable and `buildTableBody()` again
    }
  });

  // Called when the export button is clicked
  exportButton.addEventListener("click", () => {
    // Convert the logs to a blob
    const jsonString = JSON.stringify(sortedFilteredLogs(), null, 2);
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

// Function to inject rows to the given tbody
const buildTableBody = (logs, tbody) => {
  const buildRow = (log) => {
    return `<!-- div.user may seem redundant but it's needed for rounded <tr> borders on the left -->
      <td>
        <div class="user-container">
          <div class="avatar-container">
            <img src="${log.avatar}" alt="Headshot" />
          </div>
          <div class="name">
            <div class="first">${log.first}</div>
            <div class="last">${log.last}</div>
          </div>
        </div>
      </td>
      <td>
        <span class="role ${log.role}"></span>
      </td>
      <td>
        <span class="psid">${log.psid}</span>
      </td>
        <td>${log.email}</td>
      <td>
        <div class="date">${log.date}</div>
        <div class="time">${log.time}</div>
      </td>
      <td>
        <i class="fa-solid fa-trash" data-id="${log.id}"></i>
      </td>
    `;
  };
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
