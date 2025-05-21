import express from 'express';
import https from 'https'; // <--- AÑADIR MÓDULO HTTPS
import http from 'http'; // Lo mantenemos por si quieres un servidor HTTP también o por la estructura original
import fs from 'fs';     // <--- AÑADIR MÓDULO FILE SYSTEM
import path from 'path';   // <--- AÑADIR MÓDULO PATH
import cors from 'cors';
import dotenv from 'dotenv';
import { createMessageRouter } from './routes/messageRoutes';
import { MessageController } from './controllers/messageController';
import ChatService from './services/chatService';
import { NotificationPublisherService } from './rabbit/notificationsRabbit';


dotenv.config();

const app = express();
const HTTP_PORT = process.env.PORT || 4000;
const HTTPS_PORT = process.env.HTTPS_PORT || 4043;

const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, '../ssl_certs/server.key')), 
    cert: fs.readFileSync(path.join(__dirname, '../ssl_certs/server.crt')) 
};


const notificationPublisherService = new NotificationPublisherService();
const chatServiceInstance = new ChatService(notificationPublisherService);
const messageCtrl = new MessageController(chatServiceInstance);
const messageRouter = createMessageRouter(messageCtrl); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/messages', messageRouter);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'chat-service',
        stompUrl: chatServiceInstance.getWebStompURL(),
    });
});

const httpsServer = https.createServer(sslOptions, app);

async function startServer() {
    try {
        await chatServiceInstance.initialize();
        console.log('Todos los servicios necesarios han sido inicializados.');

        httpsServer.listen(HTTPS_PORT, () => {
            console.log(`Servidor HTTPS ejecutándose en https://localhost:${HTTPS_PORT}`);
            console.log(`Conexión WebSTOMP (WSS) debería estar disponible en ${chatServiceInstance.getWebStompURL()}`);
        });

        const shutdown = async (signal?: string) => {
            if (signal) console.log(`\nRecibida señal ${signal}. Cerrando servidor...`);
            else console.log('Iniciando cierre del servidor...');

            try {
                await chatServiceInstance.close();
                console.log('Servicios dependientes cerrados.');
            } catch (error) {
                console.error("Error durante el cierre de servicios:", error);
            } finally {
                
                httpsServer.close((err) => {
                    if (err) {
                        console.error("Error al cerrar el servidor HTTPS:", err);
                        process.exit(1);
                    }
                    console.log('Servidor HTTPS cerrado.');
                    process.exit(0);
                });
                
            }
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));

    } catch (error) {
        console.error('Error crítico al iniciar el servidor:', error);
        if (chatServiceInstance && typeof chatServiceInstance.close === 'function') {
            await chatServiceInstance.close().catch(closeErr => console.error("Error en cleanup de ChatService tras fallo de inicio:", closeErr));
        }
        process.exit(1);
    }
}

startServer();

export default httpsServer;