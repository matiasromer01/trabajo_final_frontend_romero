import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Verificar si hay un usuario autenticado al cargar
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const currentUser = authService.getCurrentUser();
                const isAuthenticated = authService.isAuthenticated();
                
                if (isAuthenticated && currentUser) {
                    setUser(currentUser);
                }
            } catch (error) {
                console.error('Error al inicializar autenticación:', error);
                authService.logout();
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Login
    const login = async (credentials) => {
        try {
            setError(null);
            setLoading(true);
            const data = await authService.login(credentials);
            setUser(data.user);
            return { success: true, data };
        } catch (error) {
            const errorMessage = error.message || 'Error al iniciar sesión';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Register
    const register = async (userData) => {
        try {
            setError(null);
            setLoading(true);
            const data = await authService.register(userData);
            
            // Si el registro incluye login automático
            if (data.token && data.user) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
            }
            
            return { success: true, data };
        } catch (error) {
            const errorMessage = error.message || 'Error al registrarse';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = () => {
        authService.logout();
        setUser(null);
        setError(null);
    };

    // Recuperar contraseña
    const forgotPassword = async (email) => {
        try {
            setError(null);
            setLoading(true);
            const data = await authService.forgotPassword(email);
            return { success: true, data };
        } catch (error) {
            const errorMessage = error.message || 'Error al enviar correo de recuperación';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Verificar si el usuario está autenticado
    const isAuthenticated = () => {
        return !!user && authService.isAuthenticated();
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        forgotPassword,
        isAuthenticated,
        setError, // Para limpiar errores manualmente
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
