import { WebSocket } from 'ws';
import { Client, Message } from '@stomp/stompjs';
import fetch from 'node-fetch';
import readline from 'readline';

const apiUrl = 'http://localhost:4000/api/messages'; 
const userType = 'parent';
const userId = 'parent-123';
const chatWith = 'teacher-456';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    try {
        // Obtener la configuración de STOMP
        const response = await fetch(`${apiUrl}/stomp-config`);
        if (!response.ok) {
            throw new Error(`Error fetching STOMP config: ${response.status}`);
        }
        const stompConfig = await response.json();

        // Crear el cliente STOMP
        const client = new Client({
            brokerURL: stompConfig.stompUrl,
            connectHeaders: {
                login: 'guest',
                passcode: 'guest'
            },
            reconnectDelay: 5000,
            webSocketFactory: () => {
                return new WebSocket(stompConfig.stompUrl);
            },
        });

        //Conectar y suscribirse a las colas
        client.onConnect = async () => {
            console.log(`[${userId}] Conectado a STOMP`);

            // Crear la cola del usuario
            await fetch(`${apiUrl}/queue/${userId}`, { method: 'POST' });

            // Suscribirse a la cola
            client.subscribe(`/exchange/${stompConfig.exchange}/chat.*.${userId}`, (message: Message) => {
                const receivedMsg = JSON.parse(message.body);
                console.log(`\n[${new Date(receivedMsg.timestamp).toLocaleTimeString()}] ${receivedMsg.from}: ${receivedMsg.content}`);
                rl.prompt();
            });

            // Iniciar el chat
            console.log(`Iniciando chat con ${chatWith}. Escribe un mensaje (o "salir"):`);
            rl.prompt();

            rl.on('line', (line) => {
                if (line.toLowerCase() === 'salir') {
                    client.deactivate();
                    rl.close();
                    process.exit(0);
                } else {
                    sendMessage(client, line);
                    rl.prompt();
                }
            });
        };

        client.onStompError = (frame) => {
            console.error('STOMP error:', frame);
        };

        client.onDisconnect = () => {
            console.log('Desconectado de STOMP');
        };

        client.activate();

    } catch (error) {
        console.error('Error:', error);
    }
}

function sendMessage(client: Client, content: string) {
    const message = {
        from: userId,
        to: chatWith,
        content: content,
        timestamp: new Date().toISOString()
    };
    client.publish({
        destination: `/exchange/chat_exchange/chat.${userType}.${chatWith}`,
        body: JSON.stringify(message),
        headers: { 'content-type': 'application/json' }
    });
    console.log(`[${userId}] Tú: ${content}`);
}

main();