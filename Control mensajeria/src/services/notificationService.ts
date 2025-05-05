import { notificationRabbitMQService } from '../rabbit/notificationsRabbit';
import { message } from '../types/message';

class NotificationService {
    constructor() {}

    async initialize(): Promise<void> {
        console.log('NotificationService initialized.');
        await notificationRabbitMQService.initialize();
    }

    async publishChatMessageNotification(message: message): Promise<void> {
        try {
            const routingKey = '#';
            await notificationRabbitMQService.publishMessage(routingKey, message);

        } catch (error) {
            console.error('Error al publicar notificación de chat:', error);
        }
    }

    async close(): Promise<void> {
        await notificationRabbitMQService.close();
    }
}

export const notificationService = new NotificationService();
