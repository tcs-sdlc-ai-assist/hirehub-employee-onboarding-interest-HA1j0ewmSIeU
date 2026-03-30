import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import InterestForm from './pages/InterestForm';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminSession from './services/AdminSession';

function AppContent() {
  const navigate = useNavigate();
  const [authVersion, setAuthVersion] = useState(0);

  function handleLoginClick() {
    navigate('/admin');
  }

  function handleLogoutClick() {
    AdminSession.logout();
    setAuthVersion((v) => v + 1);
    navigate('/');
  }

  function handleLoginSuccess() {
    setAuthVersion((v) => v + 1);
    navigate('/admin');
  }

  return (
    <>
      <Header
        isAdminAuthenticated={AdminSession.isAuthenticated()}
        onLoginClick={handleLoginClick}
        onLogoutClick={handleLogoutClick}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<InterestForm />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              onLogin={<AdminLogin onLoginSuccess={handleLoginSuccess} />}
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;