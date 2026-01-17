console.log("📄 singlepost.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  if (!postId) {
    document.getElementById("full-post").innerHTML =
      "<p style='color:red;'>No post specified.</p>";
    return;
  }

  fetchPost(postId);
});

async function fetchPost(id) {
  try {
    const res = await fetch(`${API_BASE}/posts/${id}?_embed`);
    if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);
    const post = await res.json();
    renderPost(post);
  } catch (err) {
    console.error(err);
    document.getElementById("full-post").innerHTML =
      "<p style='color:red;'>Unable to load post.</p>";
  }
}

function getPostImage(post) {
  if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  const temp = document.createElement("div");
  temp.innerHTML = post.content.rendered;
  const img = temp.querySelector("img");
  return img ? img.src : "images/placeholder.jpg";
}

function renderPost(post) {
  const container = document.getElementById("full-post");
  if (!container) return;

  const title = post.title.rendered;
  const content = post.content.rendered;
  const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || "Blog";
  const author = post._embedded?.author?.[0]?.name || "Admin";
  const date = new Date(post.date).toLocaleDateString();
  const image = getPostImage(post);

  container.innerHTML = `
    <article class="post-full">
      <span class="post-category">${category}</span>
      <h1 class="post-title">${title}</h1>
      <div class="post-meta">By ${author} • ${date}</div>
    
      <div class="post-content-full">${content}</div>
    </article>
  `;
}
