import amqp, { Connection, Channel, ChannelModel } from 'amqplib';
import dotenv from 'dotenv';
import ChatService from '../services/chatService';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
const RABBITMQ_WEB_STOMP_URL = process.env.RABBITMQ_WEB_STOMP_URL!;

const EXCHANGE_NAME_FOR_SAVE = process.env.CHAT_EXCHANGE_NAME || 'chat_exchange'; 
const GENERAL_CHAT_QUEUE = 'chat_save_message_queue';
const ROUTING_KEY_MESSAGES_TO_SAVE = 'chat.message.save';

export class ChatConsumerService {
    private connection: ChannelModel | null = null;
    private channel: Channel | null = null;
    private chatService: ChatService;

    constructor(chatService: ChatService) {
        this.chatService = chatService;
    }

    public getChannel(): Channel | null {
        return this.channel;
    }

    async connect(): Promise<void> {
        try {
            this.connection = await amqp.connect(RABBITMQ_URL);
            this.channel = await this.connection.createChannel();
            
            await this.channel.assertExchange(EXCHANGE_NAME_FOR_SAVE, 'topic', { durable: true });
            await this.channel.assertQueue(GENERAL_CHAT_QUEUE, { durable: true });
            await this.channel.bindQueue(GENERAL_CHAT_QUEUE, EXCHANGE_NAME_FOR_SAVE, ROUTING_KEY_MESSAGES_TO_SAVE);

            console.log(`ChatConsumerService conectado a RabbitMQ y escuchando en '${GENERAL_CHAT_QUEUE}' vinculada a '${EXCHANGE_NAME_FOR_SAVE}' con RK '${ROUTING_KEY_MESSAGES_TO_SAVE}'.`);

            this.channel.consume(GENERAL_CHAT_QUEUE, async (msg) => {
                if (msg) {
                    try {
                        const messagePayload = JSON.parse(msg.content.toString());
                       if (messagePayload &&
                            messagePayload.from &&
                            messagePayload.to &&
                            messagePayload.content &&
                            messagePayload.timestamp && 
                            messagePayload.senderUserType) {
                            
                            await this.chatService.sendMessage(messagePayload);
                            this.channel?.ack(msg);
                        } else {
                            console.warn('ChatConsumerService: Mensaje recibido con formato incorrecto o faltan campos para FullChatMessagePayload, descartando:', messagePayload);
                            this.channel?.nack(msg, false, false);
                        }
                    } catch (parseError) {
                        console.error('ChatConsumerService: Error al parsear mensaje de RabbitMQ:', parseError, msg.content.toString());
                        this.channel?.nack(msg, false, false);
                    }
                }
            }, { noAck: false });

            this.connection.on('error', (err) => console.error('Error en la conexión RabbitMQ (ChatConsumer):', err));
            this.connection.on('close', () => {
                console.log('Conexión RabbitMQ cerrada (ChatConsumer), intentando reconectar...');
                setTimeout(() => this.connect(), 5000);
            });

        } catch (error) {
            console.error('Error al conectar ChatConsumerService:', error);
            setTimeout(() => this.connect(), 5000); 
        }
    }

    async close(): Promise<void> {
        try {
            if (this.channel) await this.channel.close();
            if (this.connection) await this.connection.close();
            console.log('ChatConsumerService desconectado.');
        } catch (error) {
            console.error('Error al cerrar ChatConsumerService:', error);
        }
    }

    getWebStompURL(): string {
        if (!RABBITMQ_WEB_STOMP_URL) {
            console.warn("RABBITMQ_WEB_STOMP_URL no está definida en las variables de entorno.");
        }
        return RABBITMQ_WEB_STOMP_URL;
    }
}