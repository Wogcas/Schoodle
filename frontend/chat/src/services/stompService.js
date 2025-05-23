import { Client } from '@stomp/stompjs';

let stompClient = null;
let activeSubscriptions = {}; 

const configureStompClient = (config, onConnectedCallback) => {
    if (!config || !config.stompUrl) {
        console.error('stompService: Configuración STOMP inválida (falta stompUrl).');
        return null;
    }

    const client = new Client({
        brokerURL: config.stompUrl,
        connectHeaders: {
            login: 'guest', 
            passcode: 'guest',
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
        console.log('stompService: Conectado a STOMP Broker:', frame?.headers?.server || 'Servidor Desconocido');
        setIsConnected(true);
        if (onConnectedCallback) {
            onConnectedCallback(client);
        }
    };

    client.onStompError = (frame) => {
        console.error('stompService: Error de STOMP Broker:', frame.headers?.['message'], frame.body);
        setIsConnected(false);
    };

    client.onWebSocketError = (event) => {
        console.error('stompService: Error de WebSocket:', event.type || event);
        setIsConnected(false);
    };

    client.onDisconnect = () => {
        console.log('stompService: Desconectado del STOMP Broker.');
        setIsConnected(false);
        activeSubscriptions = {};
    };
    
    return client;
};

let _isConnected = false;
const setIsConnected = (status) => { _isConnected = status; };
export const isStompConnected = () => _isConnected;

export const connectStomp = (config, onConnectedCallback) => {
    if (stompClient && stompClient.active) {
        console.log('stompService: Ya conectado, llamando callback.');
        if (onConnectedCallback) onConnectedCallback(stompClient);
        return;
    }

    if (stompClient) {
        console.log('stompService: Cliente STOMP existente no activo, desactivando antes de reconectar.');
        stompClient.deactivate();
    }

    stompClient = configureStompClient(config, onConnectedCallback);
    if (stompClient) {
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
    activeSubscriptions = {};
    setIsConnected(false);
};

export const subscribeToMessages = (clientInstance, topic, onMessageReceivedCallback) => {
    if (!clientInstance || !clientInstance.active) {
        console.error('stompService: Cliente STOMP proporcionado no está activo o es nulo. No se puede suscribir a', topic);
        return null;
    }
    if (activeSubscriptions[topic]) {
        console.warn(`stompService: Ya existe una suscripción para ${topic} en 'activeSubscriptions'. Desuscribiendo la anterior.`);
        try {
            activeSubscriptions[topic].unsubscribe();
        } catch (e) {
            console.error(`stompService: Error al desuscribir la suscripción anterior para ${topic}`, e);
        }
        delete activeSubscriptions[topic];
    }

    console.log(`stompService: Suscribiéndose a ${topic} con el cliente proporcionado.`);
    const subscription = clientInstance.subscribe(topic, (stompMessage) => {
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
        try {
            activeSubscriptions[topic].unsubscribe();
        } catch (e) {
            console.error(`stompService: Error al desuscribir de ${topic}`, e);
        }
        delete activeSubscriptions[topic];
    } else {
        console.warn(`stompService: No se encontró suscripción activa para ${topic} para desuscribir.`);
    }
};

export const sendMessageViaStomp = (destination, messagePayload) => {
    if (!stompClient || !stompClient.active) {
        console.error('stompService: No conectado. No se puede enviar el mensaje.');
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
