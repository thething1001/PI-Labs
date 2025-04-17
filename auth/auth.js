if (!isUserLoggedIn()) {
    window.location.href = "/PI-Labs/auth/login.html";
  }

function isUserLoggedIn() {
  const token = sessionStorage.getItem("auth_token");
  return token !== null;
}

// async function checkLoginStatus() {
//   if (isUserLoggedIn()) {
//     console.log("User is logged in");
//     const userData = JSON.parse(sessionStorage.getItem("user"));
//     return true;
//   } else {
//     console.log("User is not logged in");
//     return false;
//   }
// }

// document.addEventListener("DOMContentLoaded", () => {
//   checkLoginStatus();
// });
