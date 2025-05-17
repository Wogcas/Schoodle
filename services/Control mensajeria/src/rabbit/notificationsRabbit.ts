import amqp, { Channel, ChannelModel, Connection } from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const NOTIFICATION_RABBITMQ_URL = process.env.NOTIFICATION_RABBITMQ_URL;
const NOTIFICATIONS_EXCHANGE_NAME = process.env.NOTIFICATIONS_EXCHANGE_NAME;


export class NotificationPublisherService {
    private connection: ChannelModel | null = null;
    private channel: Channel | null = null;
    private isConnecting: boolean = false;
    private retryTimeout: NodeJS.Timeout | null = null;

    async connect(): Promise<void> {
        if (this.isConnecting || (this.channel && this.connection)) {
            console.log('NotificationPublisherService: Ya está conectado o en proceso de conexión.');
            return;
        }
        this.isConnecting = true;
        if (this.retryTimeout) clearTimeout(this.retryTimeout);

        try {
            console.log(`NotificationPublisherService: Intentando conectar a RabbitMQ en ${NOTIFICATION_RABBITMQ_URL}...`);
            this.connection = await amqp.connect(NOTIFICATION_RABBITMQ_URL as string);
            console.log('NotificationPublisherService: Conexión a RabbitMQ establecida.');

            this.connection.on('error', (err) => {
                console.error('NotificationPublisherService: Error en la conexión RabbitMQ:', err.message);
                this.handleDisconnection();
            });
            this.connection.on('close', () => {
                console.log('NotificationPublisherService: Conexión RabbitMQ cerrada.');
                this.handleDisconnection();
            });

            this.channel = await this.connection.createChannel();
            console.log('NotificationPublisherService: Canal RabbitMQ creado.');

            await this.channel.assertExchange(NOTIFICATIONS_EXCHANGE_NAME as string, 'topic', { durable: true });
            
            this.isConnecting = false;
            console.log('NotificationPublisherService: Conectado y listo para publicar.');

        } catch (error) {
            console.error('NotificationPublisherService: Error detallado al conectar o configurar RabbitMQ:', error);
            this.isConnecting = false;
            this.handleDisconnection(5000); 
        }
    }

    private handleDisconnection(retryDelay: number = 5000): void {
        if (this.isConnecting) return;

        this.channel = null;

        console.log(`NotificationPublisherService: Intentando reconectar a RabbitMQ en ${retryDelay / 1000} segundos...`);
        if (this.retryTimeout) clearTimeout(this.retryTimeout);
        this.retryTimeout = setTimeout(() => {
            this.connect();
        }, retryDelay);
    }

    /**
     * Publica un mensaje a un exchange específico con una routing key.
     * @param exchangeName El nombre del exchange al que publicar.
     * @param routingKey La routing key para el mensaje.
     * @param message El objeto del mensaje a publicar (será serializado a JSON).
     * @returns true si la publicación fue exitosa (según RabbitMQ), false en caso contrario.
     */
    async publishMessage(exchangeName: string, routingKey: string, message: any): Promise<boolean> {
        if (!this.channel) {
            console.error('NotificationPublisherService: Canal no inicializado. No se puede publicar el mensaje.');
            
            return false;
        }

        try {
           await this.channel.assertExchange(exchangeName, 'topic', { durable: true });
            
            const success = this.channel.publish(
                exchangeName,
                routingKey,
                Buffer.from(JSON.stringify(message)),
                {
                    persistent: true,
                    contentType: 'application/json',
                }
            );

            if (success) {
                console.log(`NotificationPublisherService: Mensaje publicado exitosamente a exchange "${exchangeName}" con routing key "${routingKey}". Payload:`, message);
            } else {
                console.warn(`NotificationPublisherService: La publicación a RabbitMQ devolvió 'false'. El mensaje podría no haber sido enviado inmediatamente. Exchange: ${exchangeName}, Key: ${routingKey}`);
            }
            return success;

        } catch (error) {
            console.error(`Error al publicar notificación al exchange "${exchangeName}", routing key "${routingKey}":`, error);
            return false;
        }
    }

    async close(): Promise<void> {
        console.log('NotificationPublisherService: Intentando cerrar conexiones RabbitMQ...');
        if (this.retryTimeout) clearTimeout(this.retryTimeout);
        this.isConnecting = false;

        try {
            if (this.channel) {
                await this.channel.close();
                console.log('NotificationPublisherService: Canal RabbitMQ cerrado.');
                this.channel = null;
            }
            if (this.connection) {
                await this.connection.close();
                console.log('NotificationPublisherService: Conexión RabbitMQ cerrada.');
                this.connection = null;
            }
            console.log('NotificationPublisherService: Desconectado limpiamente de RabbitMQ.');
        } catch (error) {
            console.error('NotificationPublisherService: Error al cerrar conexiones RabbitMQ:', error);
        }
    }
}

export const notificationPublisherService = new NotificationPublisherService();
