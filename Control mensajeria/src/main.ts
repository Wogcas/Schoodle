import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { messageRouter } from './routes/messageRoutes';
import { chatService } from './services/chatService';
import { notificationService } from './services/notificationService';

dotenv.config();

const app = express();
const PORT = process.env.PORT ||4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/messages', messageRouter);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'chat-service',
        stompUrl: chatService.getWebStompURL()
    });
});

const server = http.createServer(app);

async function startServer() {
    try {
        await chatService.initialize();
        console.log('Chat service initialized.');
        await notificationService.initialize();
        console.log('Notification service initialized.');

        server.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
            console.log(`Conexión WebSTOMP disponible en ${chatService.getWebStompURL()}`);
        });

        const shutdown = async () => {
            console.log('Cerrando servidor...');
            try {
                await Promise.all([chatService.close(), notificationService.close()]);
                console.log('Servicios RabbitMQ cerrados.');
            } catch (error) {
                console.error("Error al cerrar servicios RabbitMQ:", error);
            } finally {
                server.close(() => {
                    console.log('Servidor HTTP cerrado');
                    process.exit(0);
                });
            }
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();

export default server;
