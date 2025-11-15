const API_URL = window.location.origin.includes('localhost')
  ? 'http://localhost:3001/api/auth'
  : '/api/auth';

// REGISTER
export async function register(username, email, password) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
      credentials: 'include'
    });

    const data = await res.json();
    if (!res.ok) return { error: data.error || data.message || 'Registration failed' };
    return { message: data.message || 'Registration successful!' };
  } catch (err) {
    return { error: err.message };
  }
}

// LOGIN
export async function login(email, password) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const data = await res.json();
    if (!res.ok) return { error: data.error || data.message || 'Login failed' };
    return { user: data.user };
  } catch (err) {
    return { error: err.message };
  }
}

// GET CURRENT USER
export async function getCurrentUser() {
  try {
    const res = await fetch(`${API_URL}/me`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch (err) {
    return null;
  }
}

// LOGOUT
export async function logout() {
  try {
    const res = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Logout failed');
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
