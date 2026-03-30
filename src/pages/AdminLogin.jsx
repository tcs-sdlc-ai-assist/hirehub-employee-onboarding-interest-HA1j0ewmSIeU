import { useState } from 'react';
import AdminSession from '../services/AdminSession';

function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    const success = AdminSession.login(username.trim(), password.trim());

    if (success) {
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      setError('Invalid username or password.');
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__icon">🔒</div>
        <h1 className="login-card__title">Admin Login</h1>
        <p className="login-card__subtitle">
          Enter your credentials to access the admin dashboard.
        </p>

        {error && <div className="login-card__error">{error}</div>}

        <form className="login-card__form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-group__label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-group__input"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-group__input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-card__submit">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;