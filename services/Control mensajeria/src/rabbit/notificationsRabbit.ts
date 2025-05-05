import amqp, { Channel, ChannelModel, Connection } from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const NOTIFICATION_RABBITMQ_URL = 'amqp://notifications:notifications@localhost:5672/';
const NOTIFICATIONS_EXCHANGE_NAME = 'notifications';


export class NotificationPublisherService {
    private connection: ChannelModel | null = null;
    private channel: Channel | null = null;

    async connect(): Promise<void> {
        try {
            this.connection = await amqp.connect(NOTIFICATION_RABBITMQ_URL);
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(NOTIFICATIONS_EXCHANGE_NAME, 'topic', { durable: true });

            console.log('NotificationPublisherService conectado a RabbitMQ.');

            this.connection.on('error', (err) => console.error('Error en la conexión RabbitMQ (NotificationPublisher):', err));
            this.connection.on('close', () => console.log('Conexión RabbitMQ cerrada (NotificationPublisher), intentando reconectar...'));

        } catch (error) {
            console.error('Error al conectar NotificationPublisherService:', error);
            setTimeout(() => this.connect(), 5000);
        }
    }

    async publishMessage(routingKey: string, message: any): Promise<boolean> {
        if (!this.channel) {
            console.error('Canal de NotificationPublisherService no inicializado.');
            return false;
        }
        try {
            await this.channel.publish(
                NOTIFICATIONS_EXCHANGE_NAME,
                routingKey,
                Buffer.from(JSON.stringify(message)),
                { persistent: true }
            );
            console.log(`Notification publicada al exchange "${NOTIFICATIONS_EXCHANGE_NAME}" con routing key "${routingKey}":`, message);
            return true;
        } catch (error) {
            console.error('Error al publicar notificación:', error);
            return false;
        }
    }

    async close(): Promise<void> {
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
        console.log('NotificationPublisherService desconectado.');
    }
}

export const notificationPublisherService = new NotificationPublisherService();

