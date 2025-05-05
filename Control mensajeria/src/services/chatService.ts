import { chatRabbitMQService } from '../rabbit/chatRabbit';
import { notificationService } from './notificationService';
import { v4 as uuidv4 } from 'uuid';
import { message } from '../types/message';

const EXCHANGE_NAME = process.env.CHAT_EXCHANGE_NAME! ||"chat_exchange";

// Provisional
const messagesDB: message[] = [];

export class ChatService {
    // Inicializar el servicio
    async initialize(): Promise<void> {
        await chatRabbitMQService.initialize();
        console.log('Servicio de chat inicializado');
    }

    async sendMessage(from: string, to: string, content: string): Promise<message> {
        const message: message = {
            id: uuidv4(),
            from,
            to,
            content,
            timestamp: new Date().toISOString(),
            read: false,
        };

        messagesDB.push(message);

        // Determinar el tipo de remitente (parent o teacher)
        const senderType = from.startsWith('parent') ? 'parent' : 'teacher';
        const receiverType = to.startsWith('parent') ? 'parent' : 'teacher';

        // Routing key formato: chat.{tipo-emisor}.{id-receptor}
        const routingKey = `chat.${senderType}.${to}`;

        await chatRabbitMQService.publishMessage(routingKey, message);

        console.log('Publicando notificación de chat...');
        try {
            await notificationService.publishChatMessageNotification(message);
        } catch (error) {
            console.error("Error al publicar notificación:", error);
        }


        console.log(`Mensaje de chat enviado: ${from} -> ${to}`);
        return message;
    }

    // Obtener historial de mensajes entre dos usuarios
    getMessageHistory(user1: string, user2: string): message[] {
        return messagesDB
            .filter(msg =>
                (msg.from === user1 && msg.to === user2) ||
                (msg.from === user2 && msg.to === user1)
            )
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    // Marcar mensaje como leído
    markMessageAsRead(messageId: string): boolean {
        const messageIndex = messagesDB.findIndex(msg => msg.id === messageId);

        if (messageIndex === -1) {
            return false;
        }

        messagesDB[messageIndex].read = true;
        return true;
    }

    // Crear cola para un usuario
    async setupUserQueue(userId: string): Promise<string> {
        return await chatRabbitMQService.createUserQueue(userId);
    }

    // Obtener URL para WebSTOMP
    getWebStompURL(): string {
        return chatRabbitMQService.getWebStompURL();
    }

    // Cerrar el servicio
    async close(): Promise<void> {
        await chatRabbitMQService.close();
    }
}

export const chatService = new ChatService();
export default chatService;
