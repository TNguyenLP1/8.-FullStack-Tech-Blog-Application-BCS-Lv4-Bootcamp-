const API_URL = 'http://localhost:3001/api';
let state = { token:null, user:null, categories:[], posts:[] };

// Persist token
if(localStorage.getItem('token')) state.token = localStorage.getItem('token');
if(localStorage.getItem('user')) state.user = JSON.parse(localStorage.getItem('user'));

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
if(themeToggle) themeToggle.onclick = ()=>{
  const html = document.documentElement;
  const next = html.getAttribute('data-theme')==='light'?'dark':'light';
  html.setAttribute('data-theme',next);
  localStorage.setItem('theme',next);
};
const savedTheme = localStorage.getItem('theme');
if(savedTheme) document.documentElement.setAttribute('data-theme',savedTheme);

// Auth helpers
async function login(email,password){
  const res = await fetch(`${API_URL}/auth/login`,{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email,password})
  });
  const data = await res.json();
  if(res.ok){ state.token=data.accessToken; state.user=data.user; localStorage.setItem('token',state.token); localStorage.setItem('user',JSON.stringify(state.user)); return true; }
  else return data.error;
}

async function register(username,email,password){
  const res = await fetch(`${API_URL}/auth/register`,{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username,email,password})
  });
  const data = await res.json();
  if(res.ok){ return true; } else return data.error;
}

function logout(){ state.token=null; state.user=null; localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='login.html'; }

// Fetch categories
async function fetchCategories(){
  const res = await fetch(`${API_URL}/categories`);
  state.categories = await res.json();
  const catSelect = document.getElementById('category');
  if(catSelect){
    catSelect.innerHTML='';
    state.categories.forEach(c=>{
      const opt=document.createElement('option');
      opt.value=c.id; opt.textContent=c.name;
      catSelect.appendChild(opt);
    });
  }
}

// Fetch posts
async function fetchPosts(){
  const res = await fetch(`${API_URL}/posts`);
  state.posts = await res.json();
  renderPosts();
}

// Render posts for index.html
function renderPosts(){
  const highlightContainer = document.getElementById('highlight-container');
  const userContainer = document.getElementById('user-container');
  if(highlightContainer) highlightContainer.innerHTML='';
  if(userContainer) userContainer.innerHTML='';

  state.posts.forEach(p=>{
    const div=document.createElement('div');
    div.className='post-card';
    div.innerHTML=`<h3>${p.title}</h3><p><em>${p.category?.name||'Uncategorized'}</em> by ${p.author?.username}</p><p>${p.excerpt||''}</p>`;
    if(state.user && (p.author.id===state.user.id || state.user.role==='ADMIN')){
      const delBtn = document.createElement('button');
      delBtn.textContent='Delete';
      delBtn.onclick=()=>deletePost(p.id);
      div.appendChild(delBtn);
    }
    if(highlightContainer) highlightContainer.appendChild(div);
    if(userContainer && state.user && p.author.id===state.user.id) userContainer.appendChild(div.cloneNode(true));
  });

  if(userContainer && userContainer.children.length>0) userContainer.parentElement.style.display='block';
}

// Delete post
async function deletePost(id){
  if(!confirm('Are you sure to delete this post?')) return;
  await fetch(`${API_URL}/posts/${id}`,{
    method:'DELETE',
    headers:{'Authorization':'Bearer '+state.token}
  });
  fetchPosts();
}

// Run init for index/editor pages
document.addEventListener('DOMContentLoaded',()=>{
  if(document.getElementById('post-form')) fetchCategories();
  if(document.getElementById('highlight-container')) fetchPosts();

  const logoutBtn = document.getElementById('logout-btn');
  if(logoutBtn) logoutBtn.onclick = logout;

  // Handle login form
  const loginForm = document.getElementById('login-form');
  if(loginForm){
    loginForm.onsubmit = async e=>{
      e.preventDefault();
      const email=document.getElementById('login-email').value;
      const password=document.getElementById('login-password').value;
      const result=await login(email,password);
      if(result===true) window.location.href='index.html';
      else document.getElementById('login-warning').textContent=result;
    };
  }

  // Handle register form
  const registerForm = document.getElementById('register-form');
  if(registerForm){
    registerForm.onsubmit = async e=>{
      e.preventDefault();
      const username=document.getElementById('register-username').value;
      const email=document.getElementById('register-email').value;
      const password=document.getElementById('register-password').value;
      const result=await register(username,email,password);
      if(result===true) window.location.href='login.html';
      else document.getElementById('register-warning').textContent=result;
    };
  }

  // Handle editor form
  const postForm = document.getElementById('post-form');
  if(postForm){
    postForm.onsubmit=async e=>{
      e.preventDefault();
      const id=postForm.dataset.postId;
      const title=document.getElementById('title').value;
      const content=document.getElementById('content').value;
      const excerpt=document.getElementById('excerpt').value;
      const categoryId=document.getElementById('category').value;
      const method = id?'PUT':'POST';
      const url = id?`${API_URL}/posts/${id}`:`${API_URL}/posts`;
      await fetch(url,{
        method,
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+state.token},
        body:JSON.stringify({title,content,excerpt,categoryId})
      });
      window.location.href='index.html';
    };
  }
});
