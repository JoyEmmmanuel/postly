/**
 * crud.js — Create, Edit, Delete posts
 * Requires user to be logged in (JWT token)
 */

document.addEventListener("DOMContentLoaded", () => {
  setupCreatePost();
  setupEditPost();
});

/* =========================
   CREATE POST
========================= */
function setupCreatePost() {
  const createForm = document.getElementById("createPostForm");
  if (!createForm) return;

  createForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) return alert("You must log in to create a post.");

    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!title || !content) return alert("Title and content are required.");

    try {
      const res = await fetch(`${CONFIG.API_BASE}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          status: "publish",
        }),
      });

      if (!res.ok) throw new Error("Failed to create post");

      alert("Post created successfully!");
      window.location.href = "index.html"; // redirect to home
    } catch (err) {
      console.error(err);
      alert("Error creating post. Check console for details.");
    }
  });
}

/* =========================
   EDIT POST
   Assumes edit page has ?id=POST_ID in URL
========================= */
function setupEditPost() {
  const editForm = document.getElementById("editPostForm");
  if (!editForm) return;

  // Load current post data into form
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");
  if (!postId) return;

  async function loadPost() {
    try {
      const res = await fetch(`${CONFIG.API_BASE}/posts/${postId}?_embed`);
      if (!res.ok) throw new Error("Failed to fetch post");
      const post = await res.json();

      document.getElementById("title").value = post.title.rendered;
      document.getElementById("content").value = post.content.rendered;
    } catch (err) {
      console.error(err);
      alert("Error loading post data.");
    }
  }
  loadPost();

  // Handle form submission
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) return alert("Login required to edit post");

    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!title || !content) return alert("Title and content are required.");

    try {
      const res = await fetch(`${CONFIG.API_BASE}/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("Failed to update post");

      alert("Post updated successfully!");
      window.location.href = `post.html?id=${postId}`;
    } catch (err) {
      console.error(err);
      alert("Error updating post");
    }
  });
}

/* =========================
   DELETE POST
========================= */
async function deletePost(postId) {
  const token = getToken();
  if (!token) return alert("You must log in to delete a post.");

  const confirmed = confirm("Are you sure you want to delete this post?");
  if (!confirmed) return;

  try {
    const res = await fetch(`${CONFIG.API_BASE}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete post");

    alert("Post deleted successfully!");
    window.location.reload(); // refresh posts
  } catch (err) {
    console.error(err);
    alert("Error deleting post");
  }
}
