import { login, register, logout, getCurrentUser } from './auth.js';
import { fetchPosts, createPost, updatePost, deletePost, fetchCategories } from './posts.js';

let state = { user: null, posts: [], categories: [] };

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

function showPostForm(post = null) {
  const form = document.getElementById('post-form');
  form.style.display = 'block';
  document.getElementById('post-id').value = post?.id || '';
  document.getElementById('post-title').value = post?.title || '';
  document.getElementById('post-excerpt').value = post?.excerpt || '';
  document.getElementById('post-content').value = post?.content || '';
  const catId = post?.Category?.id || '';
  const catSelect = document.getElementById('post-category');
  catSelect.value = catId;
}

async function initCategories() {
  const filter = document.getElementById('filter-category');
  const postCategory = document.getElementById('post-category');

  filter.innerHTML = '<option value="">All</option>';
  postCategory.innerHTML = '<option value="">Uncategorized</option>';

  state.categories = await fetchCategories();

  if (Array.isArray(state.categories) && state.categories.length > 0) {
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
  }

  filter.onchange = () => {
    const cat = filter.value;
    const filtered = cat ? state.posts.filter(p => p.Category?.id == cat) : state.posts;
    renderPosts(filtered);
  };
}

async function initAuth() {
  state.user = await getCurrentUser();

  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const logoutBtn = document.getElementById('logout-btn');
  const userGreeting = document.getElementById('user-greeting');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const postForm = document.getElementById('post-form');
  const newPostBtn = document.getElementById('new-post-btn');

  if (state.user) {
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (userGreeting) userGreeting.textContent = `Hi, ${state.user.username}`;
    if (newPostBtn) {
      newPostBtn.style.display = 'inline-block';
      newPostBtn.onclick = () => {
        document.getElementById('post-id').value = '';
        document.getElementById('post-title').value = '';
        document.getElementById('post-excerpt').value = '';
        document.getElementById('post-content').value = '';
        document.getElementById('post-category').value = '';
        postForm.style.display = 'block';
      };
    }
  } else {
    if (loginLink) loginLink.onclick = () => { loginForm.style.display = 'block'; registerForm.style.display = 'none'; };
    if (registerLink) registerLink.onclick = () => { registerForm.style.display = 'block'; loginForm.style.display = 'none'; };
    if (newPostBtn) newPostBtn.style.display = 'none';
  }

  if (logoutBtn) {
    logoutBtn.onclick = async () => {
      await logout();
      state.user = null;
      window.location.reload();
    };
  }

  if (loginForm) {
    loginForm.onsubmit = async e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const res = await login(email, password);
      if (res.error) alert(res.error);
      else window.location.reload();
    };
  }

  if (registerForm) {
    registerForm.onsubmit = async e => {
      e.preventDefault();
      const username = document.getElementById('register-username').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const res = await register(username, email, password);
      if (res.error) alert(res.error);
      else window.location.reload();
    };
  }

  if (postForm) {
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

      e.target.reset();
      postForm.style.display = 'none';
    };

    const cancelBtn = document.getElementById('cancel-post');
    if (cancelBtn) cancelBtn.onclick = () => postForm.style.display = 'none';
  }
}

async function loadPosts() {
  state.posts = await fetchPosts();
  renderPosts(state.posts);
}

export async function initApp() {
  await initAuth();
  await initCategories();
  await loadPosts();
}

initApp();