import amqplib from "amqplib";
import rabbitmqConfig from "../utils/rabbitmqConfig.js";

const TASK_SUBMISSION_QUEUE_NAME = 'taskSubmissions'; // Nombre para cola
const TASK_SUBMISSION_EXCHANGE_NAME = 'taskEvents'; // Nombre del evento de tareas
const TASK_SUBMISSION_ROUTING_KEY = '#';

export async function consumeRabbitTaskSubmissionsService() {
    let connection;
    let channel;

    try {
        const { host, port, username, password, vhost } = rabbitmqConfig;
        const connectionUrl = `amqp://${username}:${password}@${host}:${port}${vhost ? `/${vhost}` : ''}`;
        connection = await amqplib.connect(connectionUrl);
        channel = await connection.createChannel();

        const taskSubmissionExchange = rabbitmqConfig.exchanges[TASK_SUBMISSION_EXCHANGE_NAME] || { name: TASK_SUBMISSION_EXCHANGE_NAME, type: 'topic', options: { durable: true } };
        await channel.assertExchange(taskSubmissionExchange.name, taskSubmissionExchange.type, taskSubmissionExchange.options);

        const parentalApprovalQueueConfig = rabbitmqConfig.queues[TASK_SUBMISSION_QUEUE_NAME] || { name: TASK_SUBMISSION_QUEUE_NAME, options: { durable: true } };
        const assertedQueue = await channel.assertQueue(parentalApprovalQueueConfig.name, parentalApprovalQueueConfig.options);

        // Vincula cola al evento de subir de tareas con la ruta de enrutamiento
        await channel.bindQueue(assertedQueue.queue, taskSubmissionExchange.name, TASK_SUBMISSION_ROUTING_KEY);
        console.log(`Esperando mensajes en la cola "${assertedQueue.queue}"...`);


        channel.consume(assertedQueue.queue, (msg) => {
            if (msg) {
                try {
                    const taskSubmissionEvent = JSON.parse(msg.content.toString());
                    console.log('Evento de subida de tarea recibido:', taskSubmissionEvent);

                    // Lógica para procesar el evento de subida de tarea


                    channel.ack(msg);
                } catch (error) {
                    console.error('Error al procesar el mensaje:', error);
                }
            }
        }, { noAck: false });

    } catch (error) {
        console.error("Error al conectar o consumir mensajes:", error);
    } finally {
        // Se mantiene el microservicio activo
        console.log("Conexión a RabbitMQ establecida y esperando mensajes...");
    }
}

consumeRabbitTaskSubmissionsService().catch(console.error);