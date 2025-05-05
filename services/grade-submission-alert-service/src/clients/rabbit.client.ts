import amqlib from "amqplib";
import rabbitConfig from "../config/rabbitmq.config";

async function publishTestMessage() {
    let connection;
    let channel;

    try {
        const { host, port, username, password, vhost } = rabbitConfig;
        const connectionUrl = `amqp://${username}:${password}@${host}:${port}${vhost ? `/${vhost}` : ''}`;
        connection = await amqlib.connect(connectionUrl);
        channel = await connection.createChannel();

        const exchangeName = rabbitConfig.exchanges.default.name;
        const routingKey = '#'; // Usando '#' para que llegue a todas las colas ligadas al 'topic' exchange
        const message = {
            type: 'test',
            content: '¡Hola desde el cliente de prueba!',
            timestamp: new Date().toISOString()
        };
        const messageBuffer = Buffer.from(JSON.stringify(message));

        await channel.publish(exchangeName, routingKey, messageBuffer);
        console.log(`Mensaje publicado al exchange "${exchangeName}" con routing key "${routingKey}":`, message);

    } catch (error) {
        console.error("Error al publicar el mensaje de prueba:", error);
    } finally {
        if (channel) {
            await channel.close();
        }
        if (connection) {
            await connection.close();
        }
    }
}

export default publishTestMessage;