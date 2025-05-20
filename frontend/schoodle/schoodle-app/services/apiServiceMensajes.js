
const BASE_URL = 'http://192.168.100.13:4000/api/messages';

/**
 * Obtiene la configuración STOMP del backend.
 * @returns {Promise<Object>} Configuración STOMP { stompUrl, exchange }.
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
 * Obtiene el historial de mensajes entre dos usuarios.
 * @param {string} user1Id - ID del primer usuario.
 * @param {string} user2Id - ID del segundo usuario.
 * @returns {Promise<Array<Object>>} Array de objetos MessageDto.
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
 * @param {string} messageId - ID del mensaje a marcar como leído.
 * @param {string} userIdMakingRequest - ID del usuario que realiza la solicitud.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const markMessageAsRead = async (messageId, userIdMakingRequest) => {
    try {
        console.log(`apiService: Marking message ${messageId} as read by ${userIdMakingRequest}`);
        const response = await fetch(`${BASE_URL}/${messageId}/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userIdMakingRequest }),
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