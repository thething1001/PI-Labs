document.addEventListener("DOMContentLoaded", (e) => {
  // Navbar toggle
  document.getElementById("header__sideMenu").addEventListener("click", (e) => {
    const navbar = document.getElementById("navbar");
    navbar.classList.toggle("active");
    e.stopPropagation();
  });

  // Close navbar when clicking outside on small screens (<768px)
  document.addEventListener("click", (e) => {
    const navbar = document.getElementById("navbar");
    const sideMenu = document.getElementById("header__sideMenu");
    if (
      window.innerWidth < 768 &&
      !navbar.contains(e.target) &&
      !sideMenu.contains(e.target)
    ) {
      navbar.classList.remove("active");
    }
  });

  // Notifications bell functionality
  const bell = document.getElementById("header__icon_notifications");
  const signal = document.getElementById("header__notifications_signal");

  bell.addEventListener("click", (e) => {
    signal.style.opacity = "0%";
    window.location.href = "../messages/messages.html";
  });

  bell.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    bell.style.animation = "jiggle 0.3s 3";
    setTimeout(() => {
      bell.style.animation = "";
      signal.style.opacity = "100%";
    }, 900);
  });
});
