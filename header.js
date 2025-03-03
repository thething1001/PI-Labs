
document.addEventListener("DOMContentLoaded", (e) => {
  document.getElementById("header__sideMenu").addEventListener("click", (e) => {
    const navbar = document.getElementById("navbar");
    navbar.style.display = (navbar.style.display === "none") ? "block" : "none";
    const page = document.getElementById("page__container");
    page.style.display = (page.style.display === "block") ? "grid" : "block";
  });
});