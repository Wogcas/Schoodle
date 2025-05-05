import amqp, { Channel, ChannelModel, Connection } from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const NOTIFICATION_RABBITMQ_URL = 'amqp://guest:guest@localhost:5672/';
const NOTIFICATIONS_EXCHANGE_NAME = 'notifications';
const NOTIFICATIONS_QUEUE_NAME = 'notifications_queue';

class NotificationRabbitMQService {
    private connection: ChannelModel | null = null;
    private channel: Channel | null = null;
    private isClosing: boolean = false;

    async initialize(): Promise<void> {
        try {
            console.log('NotificationRabbitMQService.initialize() - Iniciando...');
            this.connection = await amqp.connect(NOTIFICATION_RABBITMQ_URL);
            console.log('NotificationRabbitMQService.initialize() - Conexión establecida:', this.connection);
            this.channel = await this.connection.createChannel();
            console.log('NotificationRabbitMQService.initialize() - Canal creado:', this.channel);

            // Declare exchange
            await this.channel.assertExchange(NOTIFICATIONS_EXCHANGE_NAME, 'topic', { durable: true });
            console.log(`NotificationRabbitMQService.initialize() - Exchange "${NOTIFICATIONS_EXCHANGE_NAME}" declarado.`);

            // Declare queue
            await this.channel.assertQueue(NOTIFICATIONS_QUEUE_NAME, { durable: true });
            console.log(`NotificationRabbitMQService.initialize() - Queue "${NOTIFICATIONS_QUEUE_NAME}" declarada.`);

            // Bind queue
            await this.channel.bindQueue(NOTIFICATIONS_QUEUE_NAME, NOTIFICATIONS_EXCHANGE_NAME, '#');
            console.log(`NotificationRabbitMQService.initialize() - Queue "${NOTIFICATIONS_QUEUE_NAME}" vinculada a exchange "${NOTIFICATIONS_EXCHANGE_NAME}" con routing key "#".`);

            this.connection.on('error', (err) => {
                console.error('Error en la conexión RabbitMQ:', err);
                this.reconnect();
            });
            this.connection.on('close', () => {
                console.log('Conexión RabbitMQ cerrada, intentando reconectar...');
                this.reconnect();
            });
            this.channel.on('error', (err) => {
                console.error('Error en el canal RabbitMQ:', err);
                this.reconnect();
            });
        } catch (error) {
            console.error('Error al inicializar RabbitMQ:', error);
            setTimeout(() => this.reconnect(), 5000);
        }
    }

    private async reconnect(): Promise<void> {
        if (this.isClosing) {
            console.log('Reconexión prevenida: Ya se está cerrando.');
            return;
        }
        try {
            if (this.channel) {
                try {
                    console.log('NotificationRabbitMQService.reconnect() - Cerrando canal...');
                    await this.channel.close();
                    console.log('NotificationRabbitMQService.reconnect() - Canal cerrado.');
                } catch (closeError: any) {
                    if (closeError.message !== 'Channel closed') {
                        console.error('Error al cerrar el canal durante la reconexión:', closeError);
                    }
                }
            }
            if (this.connection) {
                try {
                    console.log('NotificationRabbitMQService.reconnect() - Cerrando conexión...');
                    await this.connection.close();
                    console.log('NotificationRabbitMQService.reconnect() - Conexión cerrada.');
                } catch (closeError: any) {
                    if (closeError.message !== 'Connection closed') {
                        console.error('Error al cerrar la conexión durante la reconexión:', closeError);
                    }
                }
            }
        } catch (error) {
            console.error('Error al cerrar las conexiones de RabbitMQ:', error);
        } finally {
            this.connection = null;
            this.channel = null;
            this.isClosing = false;
            if (!this.isClosing) {
                setTimeout(() => this.initialize(), 5000);
            }
        }
    }

    async publishMessage(routingKey: string, message: any): Promise<boolean> {
        if (!this.channel) {
            console.error('Error: El canal de RabbitMQ no está inicializado');
            return false;
        }
        try {
            console.log(`NotificationRabbitMQService.publishMessage() - Publicando mensaje a exchange "${NOTIFICATIONS_EXCHANGE_NAME}" con routing key "${routingKey}":`, message);
            await this.channel.publish(NOTIFICATIONS_EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });
            console.log(`NotificationRabbitMQService.publishMessage() - Mensaje publicado al exchange "${NOTIFICATIONS_EXCHANGE_NAME}" con routing key "${routingKey}":`, message);
            return true;
        } catch (error) {
            console.error('Error al publicar el mensaje:', error);
            return false;
        }
    }

    async close(): Promise<void> {
        this.isClosing = true;
        console.log('Cerrando la conexión de RabbitMQ...');
        try {
            if (this.channel) {
                try {
                    console.log('NotificationRabbitMQService.close() - Cerrando canal...');
                    await this.channel.close();
                    console.log('NotificationRabbitMQService.close() - Canal cerrado.');
                } catch (closeError: any) {
                    if (closeError.message !== 'Channel closed') {
                        console.error('Error al cerrar el canal en close():', closeError);
                    }
                }
            }
            if (this.connection) {
                try {
                    console.log('NotificationRabbitMQService.close() - Cerrando conexión...');
                    await this.connection.close();
                    console.log('NotificationRabbitMQService.close() - Conexión cerrada.');
                } catch (closeError: any) {
                    if (closeError.message !== 'Connection closed') {
                        console.error('Error al cerrar la conexión en close():', closeError);
                    }
                }
            }
            console.log('Conexión de RabbitMQ cerrada.');
        } catch (error) {
            console.error('Error al cerrar la conexión de RabbitMQ:', error);
        } finally {
            this.connection = null;
            this.channel = null;
            this.isClosing = false;
        }
    }
}

export const notificationRabbitMQService = new NotificationRabbitMQService();

