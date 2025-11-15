import { login, register, logout, getCurrentUser } from './auth.js';
import { fetchPosts, createPost, updatePost, deletePost, fetchCategories } from './posts.js';

let state = { user: null, posts: [], categories: [] };

// -------------------------
// RENDER POSTS
// -------------------------
function renderPosts(posts) {
  const container = document.getElementById('highlight-container');
  container.innerHTML = '';

  posts.forEach(p => {
    const div = document.createElement('div');
    div.className = 'post-card';
    div.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.excerpt || ''}</p>
      <p>By ${p.User?.username || 'Unknown'} | Category: ${p.Category?.name || 'Uncategorized'}</p>
    `;

    if (state.user && (p.User?.id === state.user.id || state.user.role === 'ADMIN')) {
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.onclick = () => showPostForm(p);

      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.onclick = async () => {
        if (confirm('Are you sure?')) {
          const res = await deletePost(p.id);
          if (res.error) alert(res.error);
          else {
            state.posts = state.posts.filter(post => post.id !== p.id);
            renderPosts(state.posts);
          }
        }
      };

      div.appendChild(editBtn);
      div.appendChild(delBtn);
    }

    container.appendChild(div);
  });
}

// -------------------------
// SHOW POST FORM
// -------------------------
function showPostForm(post = null) {
  const form = document.getElementById('post-form');
  form.style.display = 'block';
  document.getElementById('post-id').value = post?.id || '';
  document.getElementById('post-title').value = post?.title || '';
  document.getElementById('post-excerpt').value = post?.excerpt || '';
  document.getElementById('post-content').value = post?.content || '';
  document.getElementById('post-category').value = post?.Category?.id || '';
}

// -------------------------
// INIT CATEGORIES
// -------------------------
async function initCategories() {
  state.categories = await fetchCategories();
  const filter = document.getElementById('filter-category');
  const postCategory = document.getElementById('post-category');

  filter.innerHTML = '<option value="">All</option>';
  postCategory.innerHTML = '<option value="">Uncategorized</option>';

  state.categories.forEach(c => {
    const opt1 = document.createElement('option');
    opt1.value = c.id;
    opt1.textContent = c.name;
    filter.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = c.id;
    opt2.textContent = c.name;
    postCategory.appendChild(opt2);
  });

  filter.onchange = () => {
    const cat = filter.value;
    const filtered = cat ? state.posts.filter(p => p.Category?.id == cat) : state.posts;
    renderPosts(filtered);
  };
}

// -------------------------
// INIT AUTH
// -------------------------
async function initAuth() {
  state.user = await getCurrentUser();

  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const logoutBtn = document.getElementById('logout-btn');
  const userGreeting = document.getElementById('user-greeting');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const postForm = document.getElementById('post-form');

  if (state.user) {
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    userGreeting.textContent = `Hi, ${state.user.username}`;
    postForm.style.display = 'block';
  } else {
    loginLink.onclick = () => { loginForm.style.display = 'block'; registerForm.style.display = 'none'; };
    registerLink.onclick = () => { registerForm.style.display = 'block'; loginForm.style.display = 'none'; };
  }

  logoutBtn.onclick = async () => {
    await logout();
    state.user = null;
    window.location.reload();
  };

  loginForm.onsubmit = async e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const res = await login(email, password);
    if (res.error) alert(res.error);
    else window.location.reload();
  };

  registerForm.onsubmit = async e => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const res = await register(username, email, password);
    if (res.error) alert(res.error);
    else window.location.reload();
  };

  postForm.onsubmit = async e => {
    e.preventDefault();
    const postId = document.getElementById('post-id').value;
    const title = document.getElementById('post-title').value;
    const excerpt = document.getElementById('post-excerpt').value;
    const content = document.getElementById('post-content').value;
    const categoryId = document.getElementById('post-category').value || null;

    if (postId) {
      const res = await updatePost(postId, { title, excerpt, content, categoryId });
      if (res.error) alert(res.error);
      else {
        const index = state.posts.findIndex(p => p.id == postId);
        if (index > -1) state.posts[index] = res;
        renderPosts(state.posts);
      }
    } else {
      const res = await createPost({ title, excerpt, content, categoryId });
      if (res.error) alert(res.error);
      else {
        state.posts.unshift(res);
        renderPosts(state.posts);
      }
    }

    postForm.reset();
    postForm.style.display = 'none';
  };

  document.getElementById('cancel-post').onclick = () => postForm.style.display = 'none';
}

// -------------------------
// LOAD POSTS
// -------------------------
async function loadPosts() {
  state.posts = await fetchPosts();
  renderPosts(state.posts);
}

// -------------------------
// INIT APP
// -------------------------
export async function initApp() {
  await initAuth();
  await initCategories();
  await loadPosts();
}

initApp();
