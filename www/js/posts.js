/**
 * =====================================
 * posts.js — fetch & render blog posts
 * =====================================
 */

console.log("📄 posts.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  fetchPosts();
});

/**
 * Fetch posts from WordPress
 * Supports category filtering via URL param
 */
async function fetchPosts() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  const params = new URLSearchParams(window.location.search);
  const categoryId = params.get("category");

  let url = `${API_BASE}/posts?_embed&per_page=10`;
  if (categoryId) url += `&categories=${categoryId}`;

  try {
    console.log("🌐 Fetching:", url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch posts (${res.status})`);

    const posts = await res.json();
    console.log("✅ Posts fetched:", posts);

    if (!posts.length) {
      feed.innerHTML = "<p>No posts found.</p>";
      return;
    }

    renderPosts(posts);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    feed.innerHTML = "<p style='color:red;'>Unable to load posts. Check server or API.</p>";
  }
}

/**
 * Get post image: featured > first in content > placeholder
 */
function getPostImage(post) {
  if (post._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
    return post._embedded["wp:featuredmedia"][0].source_url;
  }
  const temp = document.createElement("div");
  temp.innerHTML = post.content.rendered;
  const img = temp.querySelector("img");
  return img ? img.src : "images/placeholder.jpg";
}

/**
 * Strip HTML tags
 */
function stripHTML(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

/**
 * Truncate text
 */
function truncateText(text, max = 120) {
  return text.length > max ? text.slice(0, max) + "…" : text;
}

/**
 * Render posts into #feed
 * Shows CRUD buttons if user is logged in
 */
function renderPosts(posts) {
  const feed = document.getElementById("feed");
  if (!feed) return;

  const token = localStorage.getItem("jwtToken"); // check if user logged in

  feed.innerHTML = posts
    .map((post) => {
      const title = stripHTML(post.title.rendered);
      const excerpt = truncateText(stripHTML(post.excerpt.rendered));
      const image = getPostImage(post);
      const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Blog";
      const author = post._embedded?.author?.[0]?.name || "Admin";
      const date = new Date(post.date).toLocaleDateString();

      // CRUD buttons only for logged-in users
      const crudButtons = token
        ? `<div class="post-crud">
            <button onclick="editPost(${post.id})" class="edit-btn">✏️ Edit</button>
            <button onclick="deletePost(${post.id})" class="delete-btn">🗑 Delete</button>
          </div>`
        : "";

      return `
        <article class="post-card">
          <img src="${image}" alt="${title}" class="post-image" />
          <div class="post-content">
            <span class="post-category">${category}</span>
            <h2 class="post-title">${title}</h2>
            <p class="post-excerpt">
              ${excerpt} 
              <a href="post.html?id=${post.id}" class="read-more">Read More →</a>
            </p>
            <div class="post-meta">By ${author} • ${date}</div>
            ${crudButtons}
          </div>
        </article>
      `;
    })
    .join("");
}

/* ================================
   CRUD functions (requires JWT)
================================ */

/**
 * Delete post
 */
async function deletePost(postId) {
  const token = localStorage.getItem("jwtToken");
  if (!token) return alert("You must log in to delete a post.");

  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const res = await fetch(`${API_BASE}/posts/${postId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to delete post");

    alert("Post deleted successfully!");
    fetchPosts(); // refresh feed
  } catch (err) {
    console.error(err);
    alert("Error deleting post");
  }
}

/**
 * Edit post — redirects to create-edit page
 */
function editPost(postId) {
  window.location.href = `create-edit.html?id=${postId}`;
}
