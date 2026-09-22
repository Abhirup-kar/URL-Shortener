/**
 * BACKEND INTEGRATION SERVICE GUIDE
 * 
 * This file contains mock functions simulating real API calls to a backend server.
 * To connect to your backend:
 * 1. Replace the base URL `API_BASE_URL` with your server address (e.g., http://localhost:5000/api).
 * 2. Swap the localStorage mock code with real `fetch()` or `axios` calls as illustrated below.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL !== undefined 
  ? import.meta.env.VITE_API_BASE_URL 
  : (import.meta.env.DEV ? 'http://localhost:3000' : '');

/**
 * Helper to retrieve Auth Token (if utilizing JWT authorization)
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const backendAPI = {

  /**
   * 1. SIGN UP A NEW USER
   * - Endpoint: POST /auth/signup
   * - Body: { email, password }
   */
  signup: async (username, email, password) => {
    //BACKEND INTEGRATION CODE EXAMPLE:
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Signup failed');
    }
    return await response.json();

    // MOCK IMPLEMENTATION:
    // await new Promise(resolve => setTimeout(resolve, 800));
    // const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    // if (users.find(u => u.email === email)) {
    //   throw new Error('User already exists');
    // }
    // if (users.find(u => u.username === username)) {
    //   throw new Error('Username already taken');
    // }
    // const newUser = { username, email, password };
    // users.push(newUser);
    // localStorage.setItem('mock_users', JSON.stringify(users));
    // return { success: true, email, username };
  },

  /**
   * 2. LOG IN AN EXISTING USER
   * - Endpoint: POST /auth/login
   * - Body: { email, password }
   */
  login: async (email, password) => {
    // BACKEND INTEGRATION CODE EXAMPLE:
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Invalid credentials');
    }
    const data = await response.json();
    if (data && data.token) {
      localStorage.setItem('token', data.token);
    }
    return data; // Returns the user object directly (containing username, email, etc.)
  },

  // MOCK IMPLEMENTATION:
  // await new Promise(resolve => setTimeout(resolve, 800));
  // const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
  // const user = users.find(u => u.email === email && u.password === password);
  // if (!user) {
  //   throw new Error('Invalid email or password');
  // }
  // return { email: user.email, username: user.username || user.email.split('@')[0] };

  /**
   * 3. SHORTEN A URL
   * - Endpoint: POST /urls/shorten
   * - Body: { originalUrl, customAlias }
   * - Auth required: Optional (attach JWT header if logged in to link URL to user)
   */
  shortenURL: async (originalUrl, customAlias = '', userEmail = null) => {
    const response = await fetch(`${API_BASE_URL}/urls/shorten`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ originalUrl, customAlias, email: userEmail })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to shorten URL');
    }
    return await response.json();
  },

  /**
   * 4. FETCH USER'S SHORTENED URLS HISTORY
   * - Endpoint: POST /urls/my-urls
   * - Auth required: Yes
   */
  getUserUrls: async (userEmail) => {
    const response = await fetch(`${API_BASE_URL}/urls/my-urls`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email: userEmail })
    });
    if (!response.ok) {
      throw new Error('Failed to fetch URLs');
    }
    return await response.json();
  },

  /**
   * 5. DELETE A SHORTENED URL
   * - Endpoint: DELETE /urls/:id
   * - Auth required: Yes
   */
  deleteURL: async (id) => {
    const response = await fetch(`${API_BASE_URL}/urls/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to delete URL');
    }
    return { success: true };
  },

  /**
   * 6. TRACK A CLICK EVENT
   * - Endpoint: GET /r/:alias
   */
  trackClick: async (alias) => {
    try {
      await fetch(`${API_BASE_URL}/r/${alias}`);
    } catch (err) {
      console.warn('Click tracking failed', err);
    }
  }
};
