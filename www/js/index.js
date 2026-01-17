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
  const toggle = document.querySelector(".dropdown-toggle");
  const dropdown = document.querySelector(".nav-dropdown .dropdown-menu");

  if (!toggle || !dropdown) return;

  toggle.addEventListener("click", () => {
    dropdown.classList.toggle("active");
  });
}

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

/* =========================
   USER MENU / LOGIN STATUS
========================= */
function setupUserMenu() {
  const userMenu = document.getElementById("userMenu");
  const token = localStorage.getItem("token");

  if (token) {
    const username = localStorage.getItem("user") || "User";

    userMenu.innerHTML = `
      <i class="fa-solid fa-user"></i> ${username}
      <div class="dropdown">
        <a href="dashboard.html">Dashboard</a>
        <a href="#" id="logoutBtn">Logout</a>
      </div>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "login.html";
    });
  } else {
    userMenu.innerHTML = `<a href="login.html"><i class="fa-solid fa-user"></i> Login</a>`;
  }
}
