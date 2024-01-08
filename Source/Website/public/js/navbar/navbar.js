document.addEventListener("DOMContentLoaded", function () {
  // Get the current page URL
  var currentPage = window.location.pathname;

  // Get all navbar links
  var navbarLinks = document.querySelectorAll(".navbar-nav a");

  // Loop through each link and set the 'active' class if the href matches the current page
  navbarLinks.forEach(function (link) {
    var linkHref = link.getAttribute("href");

    if (linkHref === currentPage) {
      link.classList.add("active");
    }
  });

  // Add click event listeners to update 'active' class on navigation
  navbarLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      // Remove 'active' class from all links
      navbarLinks.forEach(function (navLink) {
        navLink.classList.remove("active");
      });

      // Add 'active' class to the clicked link
      this.classList.add("active");
    });
  });
});
