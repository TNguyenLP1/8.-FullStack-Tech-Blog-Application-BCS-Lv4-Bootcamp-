// -------------------------
// AUTH API
// -------------------------
const API_URL = 'http://localhost:3001/api/auth';

// -------------------------
// REGISTER
// -------------------------
export async function register(username, email, password) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
      credentials: 'include' // important: send/receive cookie
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');

    return data; // contains user info (without token, JWT is in cookie)
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
}

// -------------------------
// LOGIN
// -------------------------
export async function login(email, password) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    return data; // contains user info
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
}

// -------------------------
// LOGOUT
// -------------------------
export async function logout() {
  try {
    const res = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Logout failed');

    // Remove user from state
    window.location.reload();
  } catch (err) {
    console.error(err);
  }
}
