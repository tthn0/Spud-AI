// Hacky way to make the table look more "balanced" when there are an even number of rows
document.addEventListener("DOMContentLoaded", function () {
  const numTableRows = document.querySelectorAll("tr").length;
  if (numTableRows % 2 == 0)
    document.querySelector(".table-container").style.paddingBottom = "0";
});

// [Todo] Called when the trash icon is clicked
const deleteLog = (id) => {
  alert("This button doens't work yet, but it will be implemented soon.");
  // [Todo] Send a request to the server to delete the log with the given id
  // [Todo] Remove the row from the table by updating the `logs` variable and calling `buildRow()` again
};

// Build the HTML for a row in the table
const buildRow = (log) => {
  return `<tr>
            <!-- This might seem redundant but it's necessary for rounded <tr> borders on the left -->
            <td class="user-container">
                <div class="user">
                    <img src="${log.avatar}" alt="Headshot" />
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
                <i class="fa-solid fa-trash" onclick="deleteLog(${log.id})"></i>
            </td>
        </tr>
    `;
};

const table = document.querySelector("table");
const logs = JSON.parse(
  document.getElementById("logData").getAttribute("data-logData")
);

logs.forEach((log) => {
  const newRow = table.insertRow(-1); // Insert row at the end of the table
  newRow.innerHTML = buildRow(log);
});
