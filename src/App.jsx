import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router,
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/ASideBar';
import PrincipalScreen from './pages/PrincipalScreen';
import ConversationPage from './pages/ConversationPage';
import SettingsPage from './pages/SettingsPage';
import StatusPage from './pages/StatusPage';
import ComunitiesPage from './pages/ComunitiesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <Sidebar setDarkMode={setDarkMode} darkMode={darkMode} />
            <div className="content">
              <Routes>
                {/* Ruta principal - redirige a chats */}
                <Route path="/" element={<Navigate to="/chats" replace />} />
                
                {/* Rutas protegidas - requieren autenticación */}
                <Route path="/chats" element={
                  <ProtectedRoute>
                    <PrincipalScreen />
                  </ProtectedRoute>
                } />
                
                <Route path="/chat/:id" element={
                  <ProtectedRoute>
                    <ConversationPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/status" element={
                  <ProtectedRoute>
                    <StatusPage />
                  </ProtectedRoute>
                } />

                <Route path="/comunities" element={
                  <ProtectedRoute>
                    <ComunitiesPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                
                {/* Rutas públicas - autenticación */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                
              </Routes>
            </div>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;