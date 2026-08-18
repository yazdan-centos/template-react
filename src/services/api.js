import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://155.117.13.33:8080';
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
