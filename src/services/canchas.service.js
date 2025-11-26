import api from './api';

const canchasService = {
    // Obtener todas las canchas
    getAll: async (filters = {}) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const response = await api.get(`/canchas${params ? `?${params}` : ''}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener canchas' };
        }
    },

    // Obtener una cancha por ID
    getById: async (id) => {
        try {
            const response = await api.get(`/canchas/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener cancha' };
        }
    },

    // Crear una nueva cancha (solo admin)
    create: async (canchaData) => {
        try {
            const response = await api.post('/canchas', canchaData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear cancha' };
        }
    },

    // Actualizar cancha (solo admin)
    update: async (id, canchaData) => {
        try {
            const response = await api.put(`/canchas/${id}`, canchaData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar cancha' };
        }
    },

    // Eliminar cancha (solo admin)
    delete: async (id) => {
        try {
            const response = await api.delete(`/canchas/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar cancha' };
        }
    },

    // Obtener disponibilidad de una cancha
    getAvailability: async (canchaId, date) => {
        try {
            const response = await api.get(`/canchas/${canchaId}/disponibilidad`, {
                params: { date }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener disponibilidad' };
        }
    },
};

export default canchasService;
