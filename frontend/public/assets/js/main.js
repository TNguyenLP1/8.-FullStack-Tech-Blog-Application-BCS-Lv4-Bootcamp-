import { login, register, logout, getCurrentUser } from './auth.js';
import { fetchPosts, fetchCategories, createPost, updatePost, deletePost } from './posts.js';

let state = { user: null, categories: [], posts: [] };

// Theme

export function initTheme(toggleId = 'theme-toggle') {
  const toggle = document.getElementById(toggleId);
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }
}

// DOM Utils

export function showWarning(id, msg, color = 'red') {
  const el = document.getElementById(id);
  if (el) {
    el.style.color = color;
    el.textContent = msg;
  }
}

export function validateInput(input) {
  if (!input.value.trim()) input.classList.add('invalid');
  else input.classList.remove('invalid');
}

// POSTS RENDER

export function renderPosts(posts, highlightContainerId = 'highlight-container', userContainerId = 'user-container', user = null) {
  const highlightContainer = document.getElementById(highlightContainerId);
  const userContainer = document.getElementById(userContainerId);

  if (highlightContainer) highlightContainer.innerHTML = '';
  if (userContainer) userContainer.innerHTML = '';

  posts.forEach(p => {
    const div = document.createElement('div');
    div.className = 'post-card';
    div.innerHTML = `
      <h3>${p.title}</h3>
      <p><em>${p.Category?.name || 'Uncategorized'}</em> by ${p.User?.username}</p>
      <p>${p.excerpt || ''}</p>
    `;

    if (user && (p.User?.id === user.id || user.role === 'ADMIN')) {
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.onclick = async () => { await deletePost(p.id); await refreshPosts(user); };
      div.appendChild(delBtn);
    }

    if (highlightContainer) highlightContainer.appendChild(div);
    if (userContainer && user && p.User?.id === user.id) userContainer.appendChild(div.cloneNode(true));
  });

  if (userContainer && userContainer.children.length > 0) {
    userContainer.parentElement.style.display = 'block';
  }
}

export async function refreshPosts(user) {
  state.posts = await fetchPosts();
  renderPosts(state.posts, 'highlight-container', 'user-container', user);
}

// CATEGORY FILTER

export async function setupCategoryFilter(user) {
  state.categories = await fetchCategories();
  const filter = document.getElementById('filter-category');
  if (!filter || !state.categories.length) return;

  filter.innerHTML = '<option value="">All</option>';
  state.categories.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    filter.appendChild(opt);
  });

  filter.addEventListener('change', async () => {
    const cat = filter.value;
    state.posts = await fetchPosts(cat || null);
    renderPosts(state.posts, 'highlight-container', 'user-container', user);
  });
}

// AUTH INIT

export async function initUser() {
  state.user = await getCurrentUser();

  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const logoutBtn = document.getElementById('logout-btn');
  const editorLink = document.getElementById('editor-link');
  const userGreeting = document.getElementById('user-greeting');

  if (state.user) {
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (editorLink) editorLink.style.display = 'inline-block';
    if (userGreeting) userGreeting.textContent = `Hi, ${state.user.username}`;
  }

  if (logoutBtn) logoutBtn.addEventListener('click', logout);
}

// FORM VALIDATION

export function initFormValidation() {
  const inputs = document.querySelectorAll('input,textarea');
  inputs.forEach(input => input.addEventListener('blur', () => validateInput(input)));
}

// REGISTER & LOGIN FORMS

export function initAuthForms() {
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async e => {
      e.preventDefault();
      const username = document.getElementById('register-username').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const password = document.getElementById('register-password').value.trim();

      try {
        const data = await register(username, email, password);
        showWarning('register-warning', data.message || 'Registration successful!', 'green');
        registerForm.reset();
      } catch (err) {
        showWarning('register-warning', err.message);
      }
    });
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();

      try {
        await login(email, password);
        window.location.href = '/';
      } catch (err) {
        showWarning('login-warning', err.message);
      }
    });
  }
}

// INIT ALL

export async function initApp() {
  initTheme();
  initFormValidation();
  initAuthForms();
  await initUser();
  await refreshPosts(state.user);
  await setupCategoryFilter(state.user);
}
