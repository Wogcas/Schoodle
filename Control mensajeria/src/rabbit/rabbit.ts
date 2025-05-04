import amqp, { Connection, Channel, ChannelModel } from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const RABBITMQ_WEB_STOMP_URL = process.env.RABBITMQ_WEB_STOMP_URL;

const EXCHANGE_NAME = 'chat_exchange';
const QUEUE_PREFIX = 'chat_queue_';

class RabbitMQService {
    private connection: ChannelModel | null = null;
    private channel: Channel | null = null;  

  // Inicializa la conexión con RabbitMQ
  async initialize(): Promise<void> {
    try {
      this.connection = await amqp.connect(RABBITMQ_URL as string);
      this.channel = await this.connection.createChannel();
      // Configurar exchange para mensajes de chat
      await this.channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });

      console.log('Conexión a RabbitMQ establecida correctamente');

      // Configurar manejo de desconexión
      this.connection.on('error', (err) => {
        console.error('Error en la conexión RabbitMQ:', err);
        this.reconnect();
      });
      this.connection.on('close', () => {
        console.log('Conexión RabbitMQ cerrada, intentando reconectar...');
        this.reconnect();
      });
    } catch (error) {
      console.error('Error al inicializar RabbitMQ:', error);
      setTimeout(() => this.reconnect(), 5000);
    }
  }

  private async reconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      console.error('Error al cerrar conexiones previas:', error);
    }

    this.connection = null;
    this.channel = null;

    setTimeout(() => this.initialize(), 5000);
  }

  // Método para publicar mensajes en RabbitMQ
  async publishMessage(routingKey: string, message: any): Promise<boolean> {
    if (!this.channel) {
      throw new Error('Canal no inicializado');
    }

    try {
      await this.channel.publish(
        EXCHANGE_NAME,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
      );
      return true;
    } catch (error) {
      console.error('Error al publicar mensaje:', error);
      return false;
    }
  }

  // Crear una cola específica para un usuario
  async createUserQueue(userId: string): Promise<string> {
    if (!this.channel) {
      throw new Error('Canal no inicializado');
    }

    const queueName = `${QUEUE_PREFIX}${userId}`;

    try {
      // Crear la cola para el usuario
      await this.channel.assertQueue(queueName, { durable: true });
      // Vincular la cola al exchange con el routing key adecuado
      await this.channel.bindQueue(queueName, EXCHANGE_NAME, `chat.*.${userId}`);
      console.log(`Cola ${queueName} creada y vinculada correctamente`);
      return queueName;
    } catch (error) {
      console.error(`Error al crear cola para ${userId}:`, error);
      throw error;
    }
  }

  // Configurar el consumo de mensajes de una cola específica
  async consumeMessages(queueName: string, callback: (message: any) => void): Promise<void> {
    if (!this.channel) {
      throw new Error('Canal no inicializado');
    }

    try {
      await this.channel.consume(queueName, (msg) => {
        if (msg) {
          const content = JSON.parse(msg.content.toString());
          callback(content);
          this.channel?.ack(msg);
        }
      });
      console.log(`Consumidor configurado para la cola ${queueName}`);
    } catch (error) {
      console.error(`Error al configurar consumidor para ${queueName}:`, error);
      throw error;
    }
  }

  // Método para cerrar la conexión
  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.channel = null;
      this.connection = null;
      console.log('Conexión a RabbitMQ cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar la conexión a RabbitMQ:', error);
    }
  }

  // Obtener URL para conexión WebSTOMP
  getWebStompURL(): string {
    const host = new URL(RABBITMQ_URL as string).hostname;
    return `${RABBITMQ_WEB_STOMP_URL}`;
  }
}

export const rabbitMQService = new RabbitMQService();
export default rabbitMQService;