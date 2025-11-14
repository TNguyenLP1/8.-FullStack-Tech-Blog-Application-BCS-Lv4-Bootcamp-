// -------------------------
// POSTS API
// -------------------------

const API_URL = 'http://localhost:3001/api/posts';

// -------------------------
// Fetch all posts (optionally by category)
// -------------------------
export async function fetchPosts(categoryId = null) {
  let url = API_URL;
  if (categoryId) url += `?category=${categoryId}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include', // send JWT cookie
    });
    if (!res.ok) throw new Error('Failed to fetch posts');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// -------------------------
// CREATE POST
// -------------------------
export async function createPost({ title, excerpt, content, categoryId }) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, excerpt, content, categoryId }),
      credentials: 'include', // send JWT cookie
    });
    if (!res.ok) throw new Error('Failed to create post');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// -------------------------
// UPDATE POST
// -------------------------
export async function updatePost(postId, { title, excerpt, content, categoryId }) {
  try {
    const res = await fetch(`${API_URL}/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, excerpt, content, categoryId }),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to update post');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// -------------------------
// DELETE POST
// -------------------------
export async function deletePost(postId) {
  try {
    const res = await fetch(`${API_URL}/${postId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to delete post');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// -------------------------
// FETCH CATEGORIES
// -------------------------
export async function fetchCategories() {
  try {
    const res = await fetch('http://localhost:3001/api/categories', {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
