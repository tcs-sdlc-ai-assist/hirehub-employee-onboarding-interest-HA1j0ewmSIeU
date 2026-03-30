import { NavLink } from 'react-router-dom';

function Header({ isAdminAuthenticated, onLoginClick, onLogoutClick }) {
  return (
    <header className="header">
      <div className="header__container">
        <NavLink to="/" className="header__logo">
          <span className="header__logo-icon">🚀</span>
          HireHub
        </NavLink>

        <nav className="header__nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `header__nav-link${isActive ? ' header__nav-link--active' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/apply"
            className={({ isActive }) =>
              `header__nav-link${isActive ? ' header__nav-link--active' : ''}`
            }
          >
            Apply
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `header__nav-link${isActive ? ' header__nav-link--active' : ''}`
            }
          >
            Admin
          </NavLink>

          {isAdminAuthenticated ? (
            <button
              className="header__auth-btn header__auth-btn--logout"
              onClick={onLogoutClick}
            >
              Logout
            </button>
          ) : (
            <button
              className="header__auth-btn header__auth-btn--login"
              onClick={onLoginClick}
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;