import api from './api';

const reservasService = {
    // Obtener todas las reservas del usuario
    getMyReservas: async () => {
        try {
            const response = await api.get('/reservas/mis-reservas');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener reservas' };
        }
    },

    // Obtener una reserva por ID
    getById: async (id) => {
        try {
            const response = await api.get(`/reservas/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener reserva' };
        }
    },

    // Crear una nueva reserva
    create: async (reservaData) => {
        try {
            const response = await api.post('/reservas', reservaData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear reserva' };
        }
    },

    // Confirmar una reserva pendiente
    confirm: async (id) => {
        try {
            const response = await api.post(`/reservas/${id}/confirm`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al confirmar reserva' };
        }
    },

    // Actualizar una reserva
    update: async (id, reservaData) => {
        try {
            const response = await api.put(`/reservas/${id}`, reservaData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar reserva' };
        }
    },

    // Cancelar una reserva
    cancel: async (id) => {
        try {
            const response = await api.delete(`/reservas/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cancelar reserva' };
        }
    },

    // Obtener historial de reservas
    getHistory: async () => {
        try {
            const response = await api.get('/reservas/historial');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener historial' };
        }
    },
};

export default reservasService;
