import api from './api';

const mensajesService = {
    // Obtener todas las conversaciones
    getConversations: async () => {
        try {
            const response = await api.get('/conversaciones');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener conversaciones' };
        }
    },

    // Obtener una conversación específica con sus mensajes
    getConversation: async (conversationId) => {
        try {
            const response = await api.get(`/conversaciones/${conversationId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener conversación' };
        }
    },

    // Enviar un mensaje
    sendMessage: async (conversationId, messageData) => {
        try {
            const response = await api.post(`/conversaciones/${conversationId}/mensajes`, messageData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al enviar mensaje' };
        }
    },

    // Eliminar un mensaje
    deleteMessage: async (conversationId, messageId) => {
        try {
            const response = await api.delete(`/conversaciones/${conversationId}/mensajes/${messageId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar mensaje' };
        }
    },

    // Marcar mensajes como leídos
    markAsRead: async (conversationId) => {
        try {
            const response = await api.put(`/conversaciones/${conversationId}/leer`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al marcar como leído' };
        }
    },
};

export default mensajesService;
