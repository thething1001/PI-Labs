if (!isUserLoggedIn()) {
  window.location.href = "/PI-Labs/auth/login.html";
}

function isUserLoggedIn() {
  const token = sessionStorage.getItem("auth_token");
  return token !== null;
}

function tokenExpired() {
  sessionStorage.removeItem("auth_token");
  sessionStorage.removeItem("user");
  window.location.href = "/PI-Labs/auth/login.html";
}
