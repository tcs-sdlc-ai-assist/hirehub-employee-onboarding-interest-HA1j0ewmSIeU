import AdminSession from '../services/AdminSession';

function ProtectedRoute({ children, onLogin }) {
  if (AdminSession.isAuthenticated()) {
    return children;
  }

  return onLogin;
}

export default ProtectedRoute;