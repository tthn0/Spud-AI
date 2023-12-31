document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("tbody");
  const searchBar = document.querySelector("input");
  const selectOrder = document.getElementById("order");
  const selectColumn = document.getElementById("column");
  const exportButton = document.getElementById("export");

  // Retrieve the logs from the data attribute on the tbody
  const logs = JSON.parse(tbody.getAttribute("data-logs")); // Change to let logs to be able to update it later when deleting logs

  // Returns a new filtered list of logs that have fields containing the given value
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

  // Returns a new sorted list of logs based on a sort order and column to sort by
  // Order of 1 means ascending, -1 means descending
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

  // Returns a new list of logs that have been sorted and filtered
  const sortedFilteredLogs = (logs) => {
    const order = selectOrder.value;
    const column = selectColumn.value;
    const searchString = searchBar.value;

    const sorted = sortLogs(logs, order, column); // Sort first to make filtering faster
    const filtered = searchLogs(sorted, searchString); // This is because searching is more expensive
    return filtered;
  };

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

  // Called when the search bar or sort order selectors are changed
  const updateTable = () => {
    buildTableBody(sortedFilteredLogs(logs), tbody);
    highlightTableData(searchBar.value);
  };

  // Initialize the table for the first time
  updateTable();

  searchBar.addEventListener("input", updateTable);
  selectOrder.addEventListener("change", updateTable);
  selectColumn.addEventListener("change", updateTable);

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

// Function to inject rows to the given tbody
const buildTableBody = (logs, tbody) => {
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
