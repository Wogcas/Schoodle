
import { Client } from '@stomp/stompjs';

let stompClient = null;
let stompConfigCache = null; 

const configureStompClient = (config) => {
    if (!config || !config.stompUrl) {
        console.error('stompService: Configuración STOMP inválida o ausente.');
        return null;
    }

    stompConfigCache = config;

    const client = new Client({
        brokerURL: config.stompUrl,
        connectHeaders: {
            login: 'guest',
            passcode: 'guest',
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (str) => {
            console.log('STOMP DEBUG:', str);
        },
    });

    client.onConnect = (frame) => {
        console.log('stompService: Conectado a STOMP broker:', frame);
        if (typeof client.onGlobalConnect === 'function') {
            client.onGlobalConnect();
        }
    };

    client.onStompError = (frame) => {
        console.error('stompService: Error de STOMP broker:', frame.headers['message']);
        console.error('stompService: Detalles del error:', frame.body);
    };

    client.onWebSocketError = (error) => {
        console.error('stompService: Error de WebSocket:', error);
    };

    client.onDisconnect = () => {
        console.log('stompService: Desconectado del STOMP broker.');
    };
    
    return client;
};

/**
 * Conecta el cliente STOMP al broker.
 * @param {Object} config - La configuración obtenida de getStompConfig API.
 * @param {Function} onConnectedCallback - Callback a ejecutar cuando la conexión es exitosa.
 */
export const connectStomp = (config, onConnectedCallback) => {
    if (stompClient && stompClient.active) {
        console.log('stompService: Ya conectado.');
        if (onConnectedCallback) onConnectedCallback();
        return;
    }
    stompClient = configureStompClient(config);
    if (stompClient) {
        if (onConnectedCallback) {
            stompClient.onGlobalConnect = onConnectedCallback;
        }
        stompClient.activate();
    } else {
        console.error("stompService: No se pudo configurar el cliente STOMP.")
    }
};

/**
 * Desconecta el cliente STOMP.
 */
export const disconnectStomp = () => {
    if (stompClient && stompClient.active) {
        stompClient.deactivate();
    }
    stompClient = null;
    stompConfigCache = null;
};

/**
 * Se suscribe a un topic para recibir mensajes.
 * @param {string} topic - El topic al que suscribirse (ej. /exchange/chat_exchange/chat.message.notification.userId).
 * @param {Function} onMessageReceived - Callback que se ejecuta con cada mensaje recibido. (message: Parsed JSON Object)
 * @returns {Object|null} Objeto de suscripción de STOMPJS o null si no está conectado.
 */
export const subscribeToMessages = (topic, onMessageReceived) => {
    if (!stompClient || !stompClient.active) {
        console.error('stompService: No conectado. No se puede suscribir.');
        return null;
    }
    console.log(`stompService: Suscribiéndose a ${topic}`);
    return stompClient.subscribe(topic, (stompMessage) => {
        try {
            const parsedMessage = JSON.parse(stompMessage.body);
            onMessageReceived(parsedMessage);
        } catch (e) {
            console.error('stompService: Error parseando mensaje STOMP:', e, stompMessage.body);
        }
    });
};

/**
 * Publica un mensaje a un destino.
 * @param {string} destination - El destino al que publicar (ej. /exchange/chat_exchange/chat.message.save).
 * @param {Object} messagePayload - El payload del mensaje (ej. { from, to, content, timestamp }).
 */
export const sendMessageViaStomp = (destination, messagePayload) => {
    if (!stompClient || !stompClient.active) {
        console.error('stompService: No conectado. No se puede enviar el mensaje.');
        return;
    }
    if (!stompConfigCache || !stompConfigCache.exchange) {
        console.error('stompService: Configuración de exchange no disponible.');
        return;
    }

    // El destino ya debería incluir /exchange/exchange_name/routing_key
    // const fullDestination = `/exchange/${stompConfigCache.exchange}/${destination}`;
    // No, el cliente ya debe construir el destino completo como se definió en el API Summary.

    console.log(`stompService: Publicando a ${destination} con payload:`, messagePayload);
    stompClient.publish({
        destination: destination,
        body: JSON.stringify(messagePayload),
        headers: { 'content-type': 'application/json' },
    });
};

/**
 * Retorna el cliente STOMP actual (para usos avanzados o debug).
 */
export const getStompClient = () => stompClient;
