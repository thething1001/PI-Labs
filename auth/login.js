if (isUserLoggedIn()) {
  window.location.href = "/PI-Labs/students/students.html";
}

function isUserLoggedIn() {
  const token = sessionStorage.getItem("auth_token");
  return token !== null;
}

async function loginUser(email, password) {
  try {
    const response = await fetch(`${BASE_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      sessionStorage.setItem("auth_token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      return { success: true, data };
    } else {
      return { success: false, error: data.message || "Login failed" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Network error" };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login__form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("login__form_emailInput").value;
      const password = document.getElementById(
        "login__form_passwordInput"
      ).value;

      const result = await loginUser(email, password);
      console.log(result);

      if (result.success) {
        window.location.href = "/PI-Labs/students/students.html";
      } else {
        alert(result.error || "Login failed. Please try again.");
      }
    });
  }
});

// Note: logoutUser is defined in auth.js and can be imported if needed
