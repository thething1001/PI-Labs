async function logoutUser() {
  const token = sessionStorage.getItem("auth_token");
  if (!token) window.location.href = "/PI-Labs/auth/login.html";
  console.log("wfwqfqw");

  try {
    await fetch(`${BASE_API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("user");
    window.location.href = "/PI-Labs/auth/login.html";
  } catch (error) {
    console.error("Logout error:", error);
  }
}

document.addEventListener("DOMContentLoaded", (e) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  console.log(user);
  document.getElementById(
    "header__user"
  ).textContent = `${user.first_name} ${user.last_name}`;

  document.getElementById("header__logoutBtn").addEventListener("click", () => {
    logoutUser();
  });

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
