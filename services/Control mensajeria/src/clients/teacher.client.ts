import { WebSocket } from 'ws';
import { Client, Message } from '@stomp/stompjs';
import fetch from 'node-fetch';
import readline from 'readline';
import https from 'https';

const apiUrl = 'https://localhost:4043/api/messages';
const userType = 'teacher';
const userId = 'teacher-789';
const chatWith = 'parent-123';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // Para probar localmente
});

const SAVE_MESSAGE_ROUTING_KEY = 'chat.message.save';

async function main() {
    try {
        // Obtener la configuración de STOMP
        const response = await fetch(`${apiUrl}/stomp-config`, {
            agent: httpsAgent,
        });
        if (!response.ok) {
            throw new Error(`Error fetching STOMP config: ${response.status} ${await response.text()}`);
        }
        const stompConfig = await response.json();
        console.log('STOMP Config recibida:', stompConfig);

        if (!stompConfig.stompUrl || !stompConfig.exchange) {
            throw new Error('STOMP config is missing stompUrl or exchange');
        }

        // Crear el cliente STOMP
        const client = new Client({
            brokerURL: stompConfig.stompUrl,
            connectHeaders: {
                login: 'guest',
                passcode: 'guest'
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            webSocketFactory: () => {
                const ws = new WebSocket(stompConfig.stompUrl, {
                    rejectUnauthorized: false
                });
                return ws;
            },
            debug: (str) => {
            }
        });

        // Conectar y suscribirse a las colas
        client.onConnect = async () => {
            console.log(`[${userId} (${userType})] Conectado a STOMP. Exchange: ${stompConfig.exchange}`);

            // Suscribirse para recibir mensajes dirigidos a este usuario
            const subscriptionRoute = `/exchange/${stompConfig.exchange}/chat.*.${userId}`;
            console.log(`[${userId} (${userType})] Suscribiéndose a: ${subscriptionRoute}`);
            client.subscribe(subscriptionRoute, (message: Message) => {
                try {
                    const receivedMsg = JSON.parse(message.body);
                    console.log(`\n[${new Date(receivedMsg.timestamp).toLocaleTimeString()}] ${receivedMsg.from}: ${receivedMsg.content}`);
                } catch (e) {
                    console.error("Error al parsear mensaje recibido:", e);
                    console.error("Cuerpo del mensaje:", message.body);
                }
                rl.prompt(true);
            });

            // Iniciar el chat
            console.log(`Iniciando chat como ${userType} (${userId}) con ${chatWith}. Escribe "salir" para terminar.`);
            rl.prompt();

            rl.on('line', (line) => {
                if (line.toLowerCase() === 'salir') {
                    console.log('Desconectando...');
                    client.deactivate();
                    rl.close();
                    process.exit(0);
                } else if (line.trim()) {
                    sendMessage(client, line, stompConfig.exchange);
                }
                rl.prompt(true);
            });
        };

        client.onStompError = (frame) => {
            console.error(`Error de STOMP Broker: ${frame.headers['message']}`);
            console.error(`Detalles adicionales: ${frame.body}`);
            console.error('Headers del error:', frame.headers);
        };

        client.onWebSocketError = (error) => {
            console.error('Error en WebSocket:', error);
        };

        client.onDisconnect = () => {
            console.log(`[${userId} (${userType})] Desconectado de STOMP`);
        };

        console.log(`[${userId} (${userType})] Activando cliente STOMP...`);
        client.activate();

    } catch (error) {
        console.error(`Error en la función main para ${userType} (${userId}):`, error);
        process.exit(1);
    }
}

function sendMessage(client: Client, content: string, exchangeName: string) {
    const messagePayload = {
        from: userId,
        to: chatWith,
        content: content,
        timestamp: new Date().toISOString(),
        senderUserType: userType
    };

    const destination = `/exchange/${exchangeName}/${SAVE_MESSAGE_ROUTING_KEY}`;
    try {
        client.publish({
            destination: destination,
            body: JSON.stringify(messagePayload),
            headers: { 'content-type': 'application/json' }
        });
    } catch (e) {
        console.error("Error al publicar mensaje:", e);
    }
}

main();