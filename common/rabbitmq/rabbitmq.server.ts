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

            // Aquí van a registrar a los consumidores para las diferentes colas
            await this.consumeMessages(rabbitConfig.queues.default.name, this.handleDefaultMessage);
            // Puedes agregar más consumidores para otras colas aquí

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
           
        } catch (error) {
            console.error("Error parsing JSON message:", error);
           
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