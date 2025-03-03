
document.addEventListener("DOMContentLoaded", (e) => {
  document.getElementById("header__sideMenu").addEventListener("click", (e) => {
    const navbar = document.getElementById("navbar");
    navbar.style.display = (navbar.style.display === "none") ? "block" : "none";
    const page = document.getElementById("page__container");
    page.style.display = (page.style.display === "block") ? "grid" : "block";
  });

  const bell = document.getElementById("header__icon_notifications");
  const signal = document.getElementById("header__notifications_signal");

  bell.addEventListener("click", (e) => {
    signal.style.opacity = "0%"; // Hide signal
    window.location.href = "../messages/messages.html"; // Replace with actual Messages page path
  });

  bell.addEventListener("contextmenu", (e) => {
    bell.style.animation = "jiggle 0.3s 3"; // Play jiggle animation 3 times
    setTimeout(() => {
      bell.style.animation = ""; // Reset animation
      signal.style.opacity = "100%"; // Show signal
    }, 600); // Match duration of 3 jiggle cycles (0.2s * 3)
  });
});