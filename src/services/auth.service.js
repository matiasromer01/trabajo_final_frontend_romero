import api from './api';

const authService = {
    // Registro de usuario
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error en el registro' };
        }
    },

    // Login de usuario
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, user } = response.data;
            
            // Guardar token y usuario en localStorage
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al iniciar sesión' };
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Verificar si el usuario está autenticado
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    // Obtener usuario actual
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (error) {
                return null;
            }
        }
        return null;
    },

    // Recuperar contraseña
    forgotPassword: async (email) => {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al recuperar contraseña' };
        }
    },

    // Restablecer contraseña
    resetPassword: async (token, newPassword) => {
        try {
            const response = await api.post('/auth/reset-password', { 
                token, 
                newPassword 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al restablecer contraseña' };
        }
    },

    // Verificar email
    verifyEmail: async (token) => {
        try {
            const response = await api.post('/auth/verify-email', { token });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al verificar email' };
        }
    },
};

export default authService;
