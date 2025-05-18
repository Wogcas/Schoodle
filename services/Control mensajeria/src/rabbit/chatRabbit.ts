import amqp, { Connection, Channel, ChannelModel } from 'amqplib';
import dotenv from 'dotenv';
import  ChatService  from '../services/chatService';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
const RABBITMQ_WEB_STOMP_URL = process.env.RABBITMQ_WEB_STOMP_URL || "ws://localhost:15674/ws";

const EXCHANGE_NAME = 'chat_exchange';
const GENERAL_CHAT_QUEUE = 'general_chat_queue';

export class ChatConsumerService {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private chatService: ChatService;

  constructor(chatService: ChatService) {
      this.chatService = chatService;
  }

  async connect(): Promise<void> {
      try {
          this.connection = await amqp.connect(RABBITMQ_URL);
          this.channel = await this.connection.createChannel();
          await this.channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
          await this.channel.assertQueue(GENERAL_CHAT_QUEUE, { durable: true });
          await this.channel.bindQueue(GENERAL_CHAT_QUEUE, EXCHANGE_NAME, 'chat.*.*');

          console.log('ChatConsumerService conectado a RabbitMQ y escuchando...');

          this.channel.consume(GENERAL_CHAT_QUEUE, (msg) => {
              if (msg) {
                  const message = JSON.parse(msg.content.toString());
                  console.log(`[${new Date(message.timestamp).toLocaleTimeString()}] Recibido mensaje de chat:`, message);
                  this.chatService.sendMessage(message.from, message.to, message.content);
                  this.channel?.ack(msg);
              }
          });

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

