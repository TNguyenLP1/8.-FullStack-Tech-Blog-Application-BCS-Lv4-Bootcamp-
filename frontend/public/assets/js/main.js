import { login, register, logout, getCurrentUser } from './auth.js';
import { fetchPosts, createPost, updatePost, deletePost, fetchCategories } from './posts.js';
import { apiPost } from './api.js';

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
      <p>By ${p.user?.username || 'Unknown'} | Category: ${p.category?.name || 'Uncategorized'}</p>
    `;

    // Click entire card to open modal
    div.onclick = () => showPostModal(p);

    if (state.user && (p.user?.id === state.user.id || state.user.role === 'ADMIN')) {
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'btn btn-primary btn-sm me-2';
      editBtn.onclick = e => { e.stopPropagation(); showPostForm(p); };

      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.className = 'btn btn-outline-danger btn-sm';
      delBtn.onclick = e => {
        e.stopPropagation();
        // Show Bootstrap confirmation modal instead of native confirm
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
        deleteModal.show();

        const confirmBtn = document.getElementById('confirmDeleteBtn');
        confirmBtn.onclick = async () => {
          const res = await deletePost(p.id);
          if (res.error) {
            const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
            document.getElementById('errorModalBody').textContent = res.error;
            errorModal.show();
          } else {
            state.posts = state.posts.filter(post => post.id !== p.id);
            renderPosts(state.posts);
          }
          deleteModal.hide();
        };
      };

      const btnGroup = document.createElement('div');
      btnGroup.className = 'd-flex justify-content-end mt-2';
      btnGroup.appendChild(editBtn);
      btnGroup.appendChild(delBtn);

      div.appendChild(btnGroup);
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
  document.getElementById('post-category').value = post?.category?.id || '';
}

function showPostModal(post) {
  document.getElementById('modal-title').textContent = post.title;
  document.getElementById('modal-content').textContent = post.content;
  document.getElementById('modal-category').textContent = post.category?.name || 'Uncategorized';
  document.getElementById('modal-author').textContent = post.user?.username || 'Unknown';

  document.getElementById('post-modal').style.display = 'block';
}

document.getElementById('close-modal').onclick = () => {
  document.getElementById('post-modal').style.display = 'none';
};

window.onclick = e => {
  const modal = document.getElementById('post-modal');
  if (e.target === modal) modal.style.display = 'none';
};

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
    const filtered = cat ? state.posts.filter(p => p.category?.id == cat) : state.posts;
    renderPosts(filtered);
  };

  const addCategoryBtn = document.getElementById('add-category-btn');
  if (addCategoryBtn) {
    addCategoryBtn.onclick = async () => {
      const nameInput = document.getElementById('new-category-name');
      const name = nameInput.value.trim();
      if (!name) return;
      const res = await apiPost('/categories', { name });
      if (res.error) {
        alert(res.error);
      } else {
        state.categories.push(res);
        await initCategories();
        nameInput.value = '';
      }
    };
  }
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
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    userGreeting.textContent = `Hi, ${state.user.username}`;
    newPostBtn.style.display = 'inline-block';

    newPostBtn.onclick = () => {
      document.getElementById('post-id').value = '';
      document.getElementById('post-title').value = '';
      document.getElementById('post-excerpt').value = '';
      document.getElementById('post-content').value = '';
      document.getElementById('post-category').value = '';
      postForm.style.display = 'block';
    };
  } else {
    loginLink.onclick = () => { loginForm.style.display = 'block'; registerForm.style.display = 'none'; };
    registerLink.onclick = () => { registerForm.style.display = 'block'; loginForm.style.display = 'none'; };
    newPostBtn.style.display = 'none';
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

    e.target.reset();
    postForm.style.display = 'none';
  };

  const cancelBtn = document.getElementById('cancel-post');
  if (cancelBtn) cancelBtn.onclick = () => postForm.style.display = 'none';
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