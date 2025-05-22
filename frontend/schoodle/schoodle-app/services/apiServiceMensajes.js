
const BASE_URL = 'https://192.168.100.13:4043/api/messages';

/**
 * Obtiene la configuración STOMP del backend.
 */
export const getStompConfig = async () => {
    try {
        const response = await fetch(`${BASE_URL}/stomp-config`);
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error fetching STOMP config: ${response.status} ${errorData}`);
        }
        return await response.json();
    } catch (error) {
        console.error('apiService.getStompConfig error:', error);
        throw error;
    }
};

/**
 * Obtiene todas las conversaciones para un usuario específico.
 * @param {string} userId - ID del usuario.
 * @returns {Promise<Array<Object>>} Array de ConversationListItemDto.
 */
export const getConversationsForUser = async (userId) => {
    try {
        console.log(`apiService: Fetching conversations for user: ${userId}`);
        const response = await fetch(`${BASE_URL}/conversations/${userId}`);
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error fetching conversations: ${response.status} ${errorData}`);
        }
        const data = await response.json();
        console.log(`apiService: Received ${data.length} conversations`);
        return data;
    } catch (error) {
        console.error('apiService.getConversationsForUser error:', error);
        throw error;
    }
};


/**
 * Obtiene el historial de mensajes entre dos usuarios.
 */
export const getMessageHistory = async (user1Id, user2Id) => {
    try {
        console.log(`apiService: Fetching history for ${user1Id} and ${user2Id}`);
        const response = await fetch(`${BASE_URL}/history/${user1Id}/${user2Id}`);
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error fetching message history: ${response.status} ${errorData}`);
        }
        const data = await response.json();
        console.log(`apiService: Received history (${data.length} messages)`);
        return data;
    } catch (error) {
        console.error('apiService.getMessageHistory error:', error);
        throw error;
    }
};

/**
 * Marca un mensaje como leído.
 */
export const markMessageAsRead = async (messageId, userIdMakingRequest) => {
    try {
        console.log(`apiService: Marking message ${messageId} as read by ${userIdMakingRequest}`);
        const response = await fetch(`${BASE_URL}/${messageId}/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userIdMakingRequest }), // El backend espera esto en el body para pruebas
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error marking message as read: ${response.status} ${errorData.message || 'Unknown error'}`);
        }
        const data = await response.json();
        console.log('apiService: Mark as read response:', data);
        return data;
    } catch (error) {
        console.error('apiService.markMessageAsRead error:', error);
        throw error;
    }
};