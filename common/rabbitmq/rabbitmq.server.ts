import RabbitMQConnection from "./rabbitmq.connection";
import rabbitConfig from "./rabbitmq.config";

class RabbitMQServer {
    private connection: RabbitMQConnection;

    constructor() {
        this.connection = new RabbitMQConnection();
    }

    async start(): Promise<void> {
        try {
            await this.connection.connect();
            console.log("RabbitMQ server started.");

            await this.consumeMessages(rabbitConfig.queues.default.name, this.handleDefaultMessage.bind(this));

            await this.consumeMessages(rabbitConfig.queues.notifications.name, this.handleNotificationMessage);

            await this.consumeMessages(rabbitConfig.queues.tasks.name, this.handleTaskMessage);


        } catch (error) {
            console.error("Error starting RabbitMQ server:", error);
        }
    }

    private async consumeMessages(queueName: string, callback: (msg: any) => void): Promise<void> {
        try {
            const channel = await this.connection.getChannel();
            if (!channel) {
                console.error('Channel is not available for consumption.');
                return;
            }

            await channel.consume(queueName, (msg: any) => {
                if (msg !== null) {
                    callback(msg);
                    channel.ack(msg);
                }
            }, { noAck: false });

            console.log(`Consuming messages from queue "${queueName}"...`);

        } catch (error) {
            console.error(`Error consuming messages from queue "${queueName}":`, error);
        }
    }

    private handleDefaultMessage(msg: any): void {
        const content = msg.content.toString();
        console.log(`Received message from "${rabbitConfig.queues.default.name}": ${content}`);

        try {
            const messageData = JSON.parse(content);
            console.log("Parsed message data:", messageData);

            //RE-ROUTEAR EL MENSAJE A APROBACION PARENTAL
            const taskEventPayload = {
                fromDefaultQueue: true,
                data: messageData,
                timestamp: new Date().toISOString()
            };
            const taskEventBuffer = Buffer.from(JSON.stringify(taskEventPayload));

            this.connection.publish(
                rabbitConfig.exchanges.tasks.name, // Publicamos al exchange 'tasksEvents'
                'default.message', // Puedes usar un routing key específico si lo deseas
                taskEventBuffer
            );
            console.log(`Re-routed message from "${rabbitConfig.queues.default.name}" to exchange "${rabbitConfig.exchanges.tasks.name}"`);

        } catch (error) {
            console.error("Error parsing JSON message:", error);
        }
    }

    private handleNotificationMessage(msg: any): void {
        const content = msg.content.toString();
        console.log(`Received notification from "${rabbitConfig.queues.notifications.name}": ${content}`);
        try {
            const notificationData = JSON.parse(content);
            console.log("Parsed notification data:", notificationData);

        } catch (error) {
            console.error("Error parsing JSON notification message:", error);
        }
    }

    private handleTaskMessage(msg: any): void {
        const content = msg.content.toString();
        console.log(`Received task from "${rabbitConfig.queues.tasks.name}": ${content}`);
        try {
            const taskData = JSON.parse(content);
            console.log("Parsed task data:", taskData);

        } catch (error) {
            console.error("Error parsing JSON task message:", error);
        }
    }


    async stop(): Promise<void> {
        await this.connection.close();
        console.log("RabbitMQ server stopped.");
    }
}

// Crear e iniciar el servidor
const rabbitMQServer = new RabbitMQServer();
rabbitMQServer.start();

// Manejar el cierre de la aplicación
process.on('SIGINT', async () => {
    console.log('Closing RabbitMQ server...');
    await rabbitMQServer.stop();
    process.exit(0);
});
