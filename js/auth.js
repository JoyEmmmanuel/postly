/**
 * auth.js — handles login, JWT token storage, and logout
 */

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");

  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value.trim();

      if (!username || !password) {
        loginError.textContent = "Please enter both username and password.";
        return;
      }

      try {
        const res = await fetch(AUTH_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!data.token) {
          throw new Error(data.message || "Login failed");
        }

        // Save JWT token and user display name
        localStorage.setItem("jwtToken", data.token);
        localStorage.setItem("user", data.user_display_name || username);

        // Redirect to homepage after successful login
        window.location.href = "index.html";
      } catch (err) {
        console.error("Login error:", err);
        loginError.textContent =
          "Invalid login credentials. Please try again.";
      }
    });
  }

  // Optional: Auto-redirect to homepage if user is already logged in
  if (isLoggedIn() && window.location.pathname.endsWith("login.html")) {
    window.location.href = "index.html";
  }
});

/* =========================
   Helper Functions
========================= */

/**
 * Get JWT token from localStorage
 */
function getToken() {
  return localStorage.getItem("jwtToken");
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
  return !!getToken();
}

/**
 * Logout user and redirect to login page
 */
function logout() {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
