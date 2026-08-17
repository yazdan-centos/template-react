import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

const tokenKey = 'template_access_token';
const userKey = 'template_current_user';

function App() {
  const [session, setSession] = useState(() => {
    const accessToken = localStorage.getItem(tokenKey);
    const user = JSON.parse(localStorage.getItem(userKey) || 'null');
    return accessToken && user ? { accessToken, ...user } : null;
  });

  const login = (data) => {
    const next = { accessToken: data.accessToken, username: data.username, role: data.role };
    localStorage.setItem(tokenKey, next.accessToken);
    localStorage.setItem(userKey, JSON.stringify({ username: next.username, role: next.role }));
    setSession(next);
  };

  const logout = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    setSession(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={session ? <Navigate to="/" /> : <Login onLogin={login} />}
        />
        <Route
          path="/"
          element={session ? <Dashboard session={session} onLogout={logout} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
