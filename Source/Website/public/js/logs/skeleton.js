// @ts-check

/**
 * @function buildSkeletonRow
 * @description Builds a row of the table with skeleton animations.
 * @returns {string} - A raw HTML string for a row in the table.
 */
const buildSkeletonRow = () => {
  return `
    <td>
      <div class="user-container">
          <div class="image-skeleton"></div>
          <div class="name">
            <div class="skeleton first-skeleton"></div>
            <div class="skeleton last-skeleton"></div>
          </div>
      </div>
    </td>
    <td>
      <div class="skeleton role-skeleton"></div>
    </td>
    <td>
      <div class="skeleton user-id-skeleton"></div>
    </td>
    <td class="searchable">
      <div class="skeleton email-skeleton"></div>
    </td>
    <td class="searchable">
      <div class="skeleton discord-skeleton"></div>
    </td>
    <td>
      <div class="searchable date">
          <div class="skeleton date-skeleton"></div>
      </div>
      <div class="searchable time">
          <div class="skeleton time-skeleton"></div>
      </div>
    </td>
    <td>
      <!-- Empty to account for the last column -->
    </td>
  `;
};

/**
 * @function randomFloat
 * @description Generates a random floating point value inside of the provided `range`.
 * @param {[number, number]} range - An array of length two containing the min and max (in order).
 * @returns {number} - A random float between `min` and `max`.
 */
const randomFloat = ([min, max]) => {
  return Math.random() * (max - min) + min;
};

/**
 * @constant WIDTH_CONFIG
 * @description An array of objects containing the class name and range of widths for each element.
 * @type {Array<{class: string, range: [number, number]}>}
 */
const WIDTH_CONFIG = [
  {
    class: ".first-skeleton",
    range: [4, 8],
  },
  {
    class: ".last-skeleton",
    range: [4, 8],
  },
  {
    class: ".role-skeleton",
    range: [6, 10],
  },
  {
    class: ".user-id-skeleton",
    range: [6, 6],
  },
  {
    class: ".email-skeleton",
    range: [6, 12],
  },
  {
    class: ".discord-skeleton",
    range: [4, 10],
  },
  {
    class: ".date-skeleton",
    range: [5, 6],
  },
  {
    class: ".time-skeleton",
    range: [3, 4],
  },
];

/**
 * @function updateSkeletonTable
 * @description Updates the skeleton table with random widths.
 * @returns {void}
 */
const updateSkeletonTable = () => {
  const tbody = document.querySelector("tbody");
  const fragment = document.createDocumentFragment();

  // Build rows of skeleton animations, each with varying widths.
  for (let i = 0; i < 50; ++i) {
    const row = document.createElement("tr");
    row.innerHTML = buildSkeletonRow();
    WIDTH_CONFIG.forEach((item) => {
      const element = row.querySelector(item.class);
      // @ts-ignore
      element.style.width = `${randomFloat(item.range)}rem`;
    });
    fragment.appendChild(row);
  }

  // @ts-ignore
  tbody.appendChild(fragment);
};

document.addEventListener("DOMContentLoaded", updateSkeletonTable);
