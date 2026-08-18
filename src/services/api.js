import axios from 'axios';

const API_BASE =
    process.env.NODE_ENV === 'production'
        ? (process.env.REACT_APP_API_URL ?? '')
        : (process.env.REACT_APP_API_URL || 'http://localhost:8080');



const tokenKey = 'template_access_token';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(tokenKey);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
