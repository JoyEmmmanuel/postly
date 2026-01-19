/**
 * index.js — Homepage behavior, categories, and user navbar
 */

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupCategoryDropdown();
  loadCategories();
  setupUserMenu();
});

/* =========================
   MOBILE NAV TOGGLE
========================= */
function setupMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const menuClose = document.querySelector(".menu-close");
  const navLinks = document.querySelector(".nav-links");

  if (!menuToggle || !menuClose || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    navLinks.classList.add("active");
    menuToggle.classList.add("hidden");
    menuClose.classList.remove("hidden");
  });

  menuClose.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuToggle.classList.remove("hidden");
    menuClose.classList.add("hidden");
  });
}

/* =========================
   CATEGORY DROPDOWN TOGGLE
========================= */
function setupCategoryDropdown() {
  const wrapper = document.querySelector(".nav-dropdown");
  const toggle = document.querySelector(".dropdown-toggle");

  if (!wrapper || !toggle) return;

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    wrapper.classList.toggle("active");
  });
}

document.addEventListener("click", (e) => {
  const wrapper = document.querySelector(".nav-dropdown");
  if (wrapper && !wrapper.contains(e.target)) {
    wrapper.classList.remove("active");
  }
});

/* =========================
   LOAD CATEGORIES
========================= */
async function loadCategories() {
  const dropdown = document.getElementById("categoryDropdown");
  if (!dropdown) return;

  try {
    const res = await fetch(`${API_BASE}/categories?hide_empty=true`);
    if (!res.ok) throw new Error("Failed to fetch categories");

    const categories = await res.json();
    dropdown.innerHTML = "";

    categories.forEach((cat) => {
      const link = document.createElement("a");
      link.href = `index.html?category=${cat.id}`;
      link.textContent = cat.name;
      dropdown.appendChild(link);
    });
  } catch (err) {
    console.error("❌ Error loading categories:", err);
  }
}

function setupUserMenu() {
  const userMenu = document.getElementById("userMenu");
  const token = localStorage.getItem("jwtToken");
  const username = localStorage.getItem("user") || "User";

  if (token) {
    userMenu.innerHTML = `
      <div class="user-dropdown">
        <button class="user-toggle">
          <i class="fa-solid fa-user"></i>
          <span>${username}</span>
          <i class="fa-solid fa-chevron-down"></i>
        </button>
        <div class="user-menu">
          <a href="#" id="logoutBtn">Logout</a>
        </div>
      </div>
    `;

    const userDropdown = document.querySelector(".user-dropdown");
    const userToggle = document.querySelector(".user-toggle");

    userToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle("active");
    });

    document.addEventListener("click", () => {
      userDropdown.classList.remove("active");
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
      window.location.href = "login.html";
    });
  } else {
    userMenu.innerHTML = `<a href="login.html"><i class="fa-solid fa-user"></i> Login</a>`;
  }
}



document.addEventListener("deviceready", function () {

  FirebasePlugin.getToken(
    function (token) {
      console.log("FCM TOKEN:", token);
      alert("FCM Token generated");
    },
    function (error) {
      console.error(error);
      alert("FCM token error");
    }
  );

  FirebasePlugin.onMessageReceived(function (message) {
    alert("Notification received: " + message.title);
  });

});

