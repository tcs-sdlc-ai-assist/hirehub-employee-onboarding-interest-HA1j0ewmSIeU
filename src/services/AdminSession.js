const SESSION_KEY = 'hirehub_admin_auth';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

const AdminSession = {
  isAuthenticated() {
    try {
      return sessionStorage.getItem(SESSION_KEY) === 'true';
    } catch (e) {
      console.error('AdminSession: Failed to read sessionStorage.', e);
      return false;
    }
  },

  login(username, password) {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(SESSION_KEY, 'true');
        return true;
      } catch (e) {
        console.error('AdminSession: Failed to write sessionStorage.', e);
        return false;
      }
    }
    return false;
  },

  logout() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error('AdminSession: Failed to clear sessionStorage.', e);
    }
  },
};

export default AdminSession;