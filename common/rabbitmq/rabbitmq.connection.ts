import amqp, { Channel, ChannelModel, Connection } from 'amqplib';
import rabbitConfig, { ExchangeConfig, QueueConfig } from "./rabbitmq.config";

class RabbitMQConnection {
    private connection: ChannelModel | null = null;
    private channel: Channel | null = null;

    async connect(): Promise<void> {
        try {
            const { host, port, username, password, vhost } = rabbitConfig;
            const connectionUrl = `amqp://${username}:${password}@${host}:${port}${vhost ? `/${vhost}` : ''}`;
            this.connection = await amqp.connect(connectionUrl);
            this.channel = await this.connection.createChannel();
            console.log("Connected to RabbitMQ successfully.");

            await this.setupExchanges(rabbitConfig.exchanges);
            await this.setupQueues(rabbitConfig.queues);

        } catch (error) {
            console.error("Error connecting to RabbitMQ:", error);
            throw error;
        }
    }

    private async setupExchanges(exchanges: Record<string, ExchangeConfig>): Promise<void> {
        if (!this.channel) throw new Error('Channel is not initialized.');

        for (const exchangeKey in exchanges) {
            const exchange = exchanges[exchangeKey];
            await this.channel.assertExchange(exchange.name, exchange.type, exchange.options);
            console.log(`Exchange "${exchange.name}" asserted.`);
        }
    }

    private async setupQueues(queues: Record<string, QueueConfig>): Promise<void> {
        if (!this.channel) throw new Error('Channel is not initialized.');

        for (const queueKey in queues) {
            const queue = queues[queueKey];
            await this.channel.assertQueue(queue.name, queue.options);
            console.log(`Queue "${queue.name}" asserted.`);

            if (queueKey === 'default' && rabbitConfig.exchanges.default.name) {
                await this.channel.bindQueue(queue.name, rabbitConfig.exchanges.default.name, '#');
                console.log(`Queue "${queue.name}" bound to exchange "${rabbitConfig.exchanges.default.name}" with routing key "#".`);
            }
            if (queueKey === 'notifications' && rabbitConfig.exchanges.notifications.name) {
                await this.channel.bindQueue(queue.name, rabbitConfig.exchanges.notifications.name, 'chat.message.notification'); // Or a specific routing key
                console.log(`Queue "${queue.name}" bound to exchange "${rabbitConfig.exchanges.notifications.name}" with routing key "chat.message.notification".`);
            }

            if (queueKey === 'tasks' && rabbitConfig.exchanges.tasks.name) {
                await this.channel.bindQueue(queue.name, rabbitConfig.exchanges.tasks.name, '#'); // Or a specific routing key
                console.log(`Queue "${queue.name}" bound to exchange "${rabbitConfig.exchanges.tasks.name}" with routing key "#".`);
            }

            if (queue.options.deadLetterExchange) {
                await this.channel.bindQueue(queue.name, queue.options.deadLetterExchange, '');
                console.log(`Queue "${queue.name}" bound to DLX "${queue.options.deadLetterExchange}".`);
            }
        }
    }

    async publish(exchange: string, routingKey: string, message: Buffer): Promise<void> {
        if (!this.channel) throw new Error('Channel is not initialized.');

        this.channel.publish(exchange, routingKey, message);
        console.log(`Message published to exchange "${exchange}" with routing key "${routingKey}".`);
    }

    getChannel(): any {
        return this.channel;
    }

    async close(): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
                console.log('Channel closed.');
            }
            if (this.connection) {
                await this.connection.close();
                console.log('Connection closed.');
            }
        } catch (error) {
            console.error('Error closing RabbitMQ connection:', error);
        }
    }
}

export default RabbitMQConnection;