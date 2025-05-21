
import { Client } from '@stomp/stompjs';

let stompClient = null;
let stompConfigCache = null;
let activeSubscriptions = {};

const configureStompClient = (config) => {
    if (!config || !config.stompUrl) {
        console.error('stompService: Configuración STOMP inválida.');
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
        },
    });

    client.onConnect = (frame) => {
        console.log('stompService: Conectado a STOMP broker:', frame ? frame.headers.server : 'Unknown Server');
        if (typeof client.onGlobalConnect === 'function') {
            client.onGlobalConnect(client);
        }
    };
    client.onStompError = (frame) => {
        console.error('stompService: Error de STOMP broker:', frame.headers?.['message'], frame.body);
    };
    client.onWebSocketError = (error) => {
        console.error('stompService: Error de WebSocket:', error);
    };
    client.onDisconnect = () => {
        console.log('stompService: Desconectado del STOMP broker.');
        activeSubscriptions = {};
    };
    return client;
};

export const connectStomp = (config, onConnectedCallback) => {
    if (stompClient && stompClient.active) {
        console.log('stompService: Ya conectado.');
        if (onConnectedCallback) onConnectedCallback(stompClient);
        return;
    }
    stompClient = configureStompClient(config);
    if (stompClient) {
        if (onConnectedCallback) {
            stompClient.onGlobalConnect = onConnectedCallback;
        }
        console.log("stompService: Activando cliente STOMP...");
        stompClient.activate();
    } else {
        console.error("stompService: No se pudo configurar el cliente STOMP.");
    }
};

export const disconnectStomp = () => {
    if (stompClient && stompClient.active) {
        console.log("stompService: Desactivando cliente STOMP...");
        stompClient.deactivate();
    }
    stompClient = null;
    stompConfigCache = null;
    activeSubscriptions = {};
};

export const subscribeToMessages = (topic, onMessageReceivedCallback) => {
    if (!stompClient || !stompClient.active) {
        console.error('stompService: No conectado. No se puede suscribir.');
        return null;
    }
    if (activeSubscriptions[topic]) {
        console.log(`stompService: Ya suscrito a ${topic}. Reutilizando suscripción.`);
        return activeSubscriptions[topic];
    }

    console.log(`stompService: Suscribiéndose a ${topic}`);
    const subscription = stompClient.subscribe(topic, (stompMessage) => {
        try {
            const parsedMessage = JSON.parse(stompMessage.body);
            onMessageReceivedCallback(parsedMessage);
        } catch (e) {
            console.error('stompService: Error parseando mensaje STOMP:', e, stompMessage.body);
        }
    });
    activeSubscriptions[topic] = subscription;
    return subscription;
};

export const unsubscribeFrom = (topic) => {
    if (activeSubscriptions[topic]) {
        console.log(`stompService: Desuscribiéndose de ${topic}`);
        activeSubscriptions[topic].unsubscribe();
        delete activeSubscriptions[topic];
    }
};

export const sendMessageViaStomp = (destination, messagePayload) => {
    if (!stompClient || !stompClient.active) {
        console.error('stompService: No conectado. No se puede enviar el mensaje.');
        return false;
    }
    if (!stompConfigCache || !stompConfigCache.exchange) {
        console.error('stompService: Configuración de exchange no disponible.');
        return false;
    }
    
    console.log(`stompService: Publicando a ${destination} con payload:`, messagePayload);
    try {
        stompClient.publish({
            destination: destination,
            body: JSON.stringify(messagePayload),
            headers: { 'content-type': 'application/json' },
        });
        return true;
    } catch (error) {
        console.error(`stompService: Error publicando mensaje a ${destination}:`, error);
        return false;
    }
};

export const getStompClient = () => stompClient;