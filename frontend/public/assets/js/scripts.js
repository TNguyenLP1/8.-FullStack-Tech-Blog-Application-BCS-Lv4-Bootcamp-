const API_URL = 'http://localhost:3001/api';
let state = { token: null, user: null, categories: [], posts: [] };

// -------------------------
// Persist token & user
// -------------------------
state.token = localStorage.getItem('token') || null;
state.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

// -------------------------
// Theme toggle
// -------------------------
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

if (themeToggle) {
  themeToggle.onclick = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  };
}

// Apply saved theme on load
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

// -------------------------
// Auth helpers
// -------------------------
async function login(email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      state.token = data.accessToken;
      state.user = data.user;
      localStorage.setItem('token', state.token);
      localStorage.setItem('user', JSON.stringify(state.user));
      return true;
    }
    return data.error || 'Invalid credentials';
  } catch (err) {
    console.error('Login network error:', err);
    return 'Network error';
  }
}

async function register(username, email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (res.ok) return true;
    return data.error || 'Registration failed';
  } catch (err) {
    console.error('Register network error:', err);
    return 'Network error';
  }
}

function logout() {
  state.token = null;
  state.user = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// -------------------------
// Fetch categories
// -------------------------
async function fetchCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`);
    state.categories = await res.json();
    const catSelect = document.getElementById('category');
    if (catSelect) {
      catSelect.innerHTML = '';
      state.categories.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        catSelect.appendChild(opt);
      });
    }
  } catch (err) {
    console.error('Failed to fetch categories', err);
  }
}

// -------------------------
// Fetch posts
// -------------------------
async function fetchPosts() {
  try {
    const res = await fetch(`${API_URL}/posts`);
    state.posts = await res.json();
    renderPosts();
  } catch (err) {
    console.error('Failed to fetch posts', err);
  }
}

// -------------------------
// Render posts
// -------------------------
function renderPosts() {
  const highlightContainer = document.getElementById('highlight-container');
  const userContainer = document.getElementById('user-container');
  if (highlightContainer) highlightContainer.innerHTML = '';
  if (userContainer) userContainer.innerHTML = '';

  state.posts.forEach(p => {
    const div = document.createElement('div');
    div.className = 'post-card';
    div.innerHTML = `
      <h3>${p.title}</h3>
      <p><em>${p.Category?.name || 'Uncategorized'}</em> by ${p.User?.username}</p>
      <p>${p.excerpt || ''}</p>
    `;

    if (state.user && (p.User?.id === state.user.id || state.user.role === 'ADMIN')) {
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.onclick = () => deletePost(p.id);
      div.appendChild(delBtn);
    }

    if (highlightContainer) highlightContainer.appendChild(div);
    if (userContainer && state.user && p.User?.id === state.user.id) {
      userContainer.appendChild(div.cloneNode(true));
    }
  });

  if (userContainer && userContainer.children.length > 0) {
    userContainer.parentElement.style.display = 'block';
  }
}

// -------------------------
// Delete post
// -------------------------
async function deletePost(id) {
  if (!confirm('Are you sure to delete this post?')) return;
  try {
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + state.token }
    });
    if (!res.ok) throw new Error('Delete failed');
    fetchPosts();
  } catch (err) {
    console.error('Failed to delete post', err);
  }
}

// -------------------------
// Initialize page
// -------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Fetch posts & categories if applicable
  if (document.getElementById('highlight-container')) fetchPosts();
  if (document.getElementById('post-form')) fetchCategories();

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.onclick = logout;

  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.onsubmit = async e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const result = await login(email, password);
      const warningEl = document.getElementById('login-warning');
      if (result === true) window.location.href = 'index.html';
      else if (warningEl) warningEl.textContent = result;
    };
  }

  // Register form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.onsubmit = async e => {
      e.preventDefault();
      const username = document.getElementById('register-username').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const result = await register(username, email, password);
      const warningEl = document.getElementById('register-warning');
      if (result === true) window.location.href = 'login.html';
      else if (warningEl) warningEl.textContent = result;
    };
  }

  // Editor form
  const postForm = document.getElementById('post-form');
  if (postForm) {
    postForm.onsubmit = async e => {
      e.preventDefault();
      const id = postForm.dataset.postId;
      const title = document.getElementById('title').value;
      const content = document.getElementById('content').value;
      const excerpt = document.getElementById('excerpt').value;
      const categoryId = document.getElementById('category').value;
      const method = id ? 'PUT' : 'POST';
      const url = id ? `${API_URL}/posts/${id}` : `${API_URL}/posts`;

      try {
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + state.token
          },
          body: JSON.stringify({ title, content, excerpt, categoryId })
        });
        if (!res.ok) throw new Error('Failed to save post');
        window.location.href = 'index.html';
      } catch (err) {
        console.error('Failed to save post', err);
        const warningEl = document.getElementById('post-warning');
        if (warningEl) warningEl.textContent = 'Failed to save post';
      }
    };
  }
});
