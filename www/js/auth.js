ocument.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");

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

        // Redirect to homepage
        window.location.href = "index.html";
      } catch (err) {
        console.error("Login error:", err);
        loginError.textContent =
          "Invalid login credentials. Please try again.";
      }
    });
  }

  // Redirect if already logged in
  if (isLoggedIn() && window.location.pathname.endsWith("login.html")) {
    window.location.href = "index.html";
  }
});

/* ========================= Helper Functions ========================= */

function getToken() {
  return localStorage.getItem("jwtToken");
}

function isLoggedIn() {
  return !!getToken();
}

function logout() {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}