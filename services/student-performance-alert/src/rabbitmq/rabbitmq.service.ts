import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: Connection;
  private channel: Channel;
  private exchangeName = 'default_exchange';
  private exchangeType = 'topic';

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
    await this.createExchange();
  }

  async connect() {
    try {
      const rabbitUrl = this.configService.get<string>('rabbitUrl');
      this.connection = await connect(rabbitUrl);
      this.channel = await this.connection.createChannel();

      this.connection.on('close', () => {
        this.logger.error('Conexión a RabbitMQ perdida, intentando reconectar...');
        setTimeout(() => this.connect(), 5000); // Intenta reconectar cada 5 segundos
      });

      this.channel.on('error', (err) => {
        this.logger.error('Error en el canal de RabbitMQ:', err);
      });

      this.logger.log('Conectado a RabbitMQ');
    } catch (error) {
      this.logger.error('Error al conectar a RabbitMQ:', error);
      setTimeout(() => this.connect(), 5000); // Intenta conectar de nuevo si falla inicialmente
    }
  }

  async createExchange() {
    try {
      await this.channel.assertExchange(this.exchangeName, this.exchangeType, {
        durable: true, // La durabilidad del exchange
      });
      this.logger.log(`Exchange '${this.exchangeName}' creado`);
    } catch (error) {
      this.logger.error(`Error al crear el exchange '${this.exchangeName}':`, error);
    }
  }

  async publish(routingKey: string, message: any) {
    try {
      if (!this.channel) {
        this.logger.error('No se puede publicar el mensaje, el canal de RabbitMQ no está disponible.');
        return;
      }
      this.channel.publish(
        this.exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(message)),
      );
      this.logger.debug(`Mensaje publicado en '${this.exchangeName}' con routing key '${routingKey}': ${JSON.stringify(message)}`);
    } catch (error) {
      this.logger.error('Error al publicar el mensaje en RabbitMQ:', error);
    }
  }
}