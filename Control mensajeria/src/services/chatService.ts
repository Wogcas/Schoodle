// src/services/chatService.ts
import { v4 as uuidv4 } from 'uuid';
import { message } from '../types/message';
import { NotificationPublisherService } from '../rabbit/notificationsRabbit'; 
import { ChatConsumerService } from '../rabbit/chatRabbit';

const EXCHANGE_NAME = process.env.CHAT_EXCHANGE_NAME! || "chat_exchange";

// Provisional
const messagesDB: message[] = [];

export default class ChatService {
    private notificationPublisherService: NotificationPublisherService;
    private chatConsumerService: ChatConsumerService = new ChatConsumerService(this);

    constructor(notificationPublisherService: NotificationPublisherService) {
        this.notificationPublisherService = notificationPublisherService;
    }

    async initialize(): Promise<void> {
        console.log('Servicio de chat inicializado.');
        await this.notificationPublisherService.connect();
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

        // Routing key formato: chat.{tipo-emisor}.{id-receptor} (para otros consumidores de chat)
        const chatRoutingKey = `chat.${senderType}.${to}`;

        console.log(`[${new Date(message.timestamp).toLocaleTimeString()}] Mensaje de chat recibido de ${from} a ${to}: ${content}`);

        try {
            await this.notificationPublisherService.publishMessage('#', message);
            console.log('Notificación de chat publicada.');
        } catch (error) {
            console.error('Error al publicar la notificación de chat:', error);
        }

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

    // Obtener URL para WebSTOMP
    getWebStompURL(): string {
        return this.chatConsumerService.getWebStompURL();
    }

    async close(): Promise<void> {
        await this.notificationPublisherService.close();
        console.log('ChatService cerrado.');
    }
}
