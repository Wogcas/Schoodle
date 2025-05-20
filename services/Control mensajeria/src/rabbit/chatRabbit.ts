import amqp, { Connection, Channel, ChannelModel } from 'amqplib';
import dotenv from 'dotenv';
import  ChatService  from '../services/chatService';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
const RABBITMQ_WEB_STOMP_URL = process.env.RABBITMQ_WEB_STOMP_URL || "ws://localhost:15674/ws";

const EXCHANGE_NAME = 'chat_exchange';
const GENERAL_CHAT_QUEUE = 'chat_save_message_queue';
const ROUTING_KEY_MESSAGES = 'chat.message.save';

export class ChatConsumerService {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private chatService: ChatService;
  private isConnecting: boolean = false;
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(chatService: ChatService) {
      this.chatService = chatService;
  }

  async connect(): Promise<void> {
      try {
          this.connection = await amqp.connect(RABBITMQ_URL);
          this.channel = await this.connection.createChannel();
          await this.channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
          await this.channel.assertQueue(GENERAL_CHAT_QUEUE, { durable: true });
          await this.channel.bindQueue(GENERAL_CHAT_QUEUE, EXCHANGE_NAME, ROUTING_KEY_MESSAGES);

          console.log('ChatConsumerService conectado a RabbitMQ y escuchando...');

          this.channel.consume(GENERAL_CHAT_QUEUE, async (msg) => {
            if (msg) {
                try {
                    const messagePayload = JSON.parse(msg.content.toString());
                    // El payload debe tener 'from', 'to', 'content'
                    if (messagePayload && messagePayload.from && messagePayload.to && messagePayload.content) {
                        await this.chatService.sendMessage(messagePayload.from, messagePayload.to, messagePayload.content);
                        this.channel?.ack(msg);
                    } else {
                        console.warn('ChatConsumerService: Mensaje recibido con formato incorrecto, descartando:', messagePayload);
                        this.channel?.nack(msg, false, false);
                    }
                } catch (parseError) {
                    console.error('ChatConsumerService: Error al parsear mensaje de RabbitMQ:', parseError, msg.content.toString());
                    this.channel?.nack(msg, false, false);
                }
            }
        }, { noAck: false });

          this.connection.on('error', (err) => console.error('Error en la conexión RabbitMQ (ChatConsumer):', err));
          this.connection.on('close', () => console.log('Conexión RabbitMQ cerrada (ChatConsumer), intentando reconectar...'));

      } catch (error) {
          console.error('Error al conectar ChatConsumerService:', error);
          setTimeout(() => this.connect(), 5000);
      }
  }

  async close(): Promise<void> {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      console.log('ChatConsumerService desconectado.');
  }

  // Obtener URL para conexión WebSTOMP
  getWebStompURL(): string {
    return `${RABBITMQ_WEB_STOMP_URL}`;
  }
}

