import amqplib from "amqplib";
import rabbitmqConfig from "../utils/rabbitmqConfig.js";
import { handleTaskEvent } from "../data-base/HandleTaskEvent.js";
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TASK_SUBMISSION_QUEUE_NAME = 'taskSubmissions';
const TASK_SUBMISSION_EXCHANGE_NAME = 'tasksEvents';
const TASK_SUBMISSION_ROUTING_KEY = '#';

let connection;
let channel;

async function ensureConnectionAndChannel() {
    if (!connection) {
        const { host, port, username, password, vhost } = rabbitmqConfig;

        const certPath = path.resolve(__dirname, '../certs/cert.pem');
        const keyPath = path.resolve(__dirname, '../certs/key.pem');


        // Configuración TLS simplificada
        const options = {
            cert: fs.readFileSync(certPath),
            key: fs.readFileSync(keyPath),
            rejectUnauthorized: false,
            credentials: amqplib.credentials.external()
        };

        const connectionUrl = `amqps://${username}:${password}@${host}:${port}${vhost ? `/${vhost}` : ''}`;

        try {
            connection = await amqplib.connect(connectionUrl, options);
            console.log('[CLIENTE] Conexión segura a RabbitMQ establecida.');

            connection.on('error', (err) => {
                console.error('Error en la conexión a RabbitMQ:', err);
                connection = null;
            });

            channel = await connection.createChannel();
            console.log('[CLIENTE] Canal seguro creado.');

            const taskSubmissionExchange = rabbitmqConfig.exchanges[TASK_SUBMISSION_EXCHANGE_NAME] || {
                name: TASK_SUBMISSION_EXCHANGE_NAME,
                type: 'topic',
                options: { durable: true }
            };

            await channel.assertExchange(
                taskSubmissionExchange.name,
                taskSubmissionExchange.type,
                taskSubmissionExchange.options
            );

            const parentalApprovalQueueConfig = rabbitmqConfig.queues[TASK_SUBMISSION_QUEUE_NAME] || {
                name: TASK_SUBMISSION_QUEUE_NAME,
                options: { durable: true }
            };

            const assertedQueue = await channel.assertQueue(
                parentalApprovalQueueConfig.name,
                parentalApprovalQueueConfig.options
            );

            await channel.bindQueue(
                assertedQueue.queue,
                taskSubmissionExchange.name,
                TASK_SUBMISSION_ROUTING_KEY
            );

            console.log(`Cola "${assertedQueue.queue}" vinculada al exchange "${taskSubmissionExchange.name}"`);

        } catch (error) {
            console.error('Error al establecer conexión segura con RabbitMQ:', error);
            throw error;
        }
    }
}


export async function publishTaskSubmissionEvent(payload) {
    try {
        await ensureConnectionAndChannel();
        if (channel) {
            const exchangeName = rabbitmqConfig.exchanges[TASK_SUBMISSION_EXCHANGE_NAME]?.name || TASK_SUBMISSION_EXCHANGE_NAME;
            const messageBuffer = Buffer.from(JSON.stringify(payload));
            channel.publish(exchangeName, TASK_SUBMISSION_ROUTING_KEY, messageBuffer);
            console.log(`Evento de subida de tarea publicado al exchange "${exchangeName}" con routing key "${TASK_SUBMISSION_ROUTING_KEY}"`);
            return true;
        } else {
            console.error("No se pudo publicar el evento: canal no disponible.");
            return false;
        }
    } catch (error) {
        console.error("Error al publicar el evento:", error);
        return false;
    }
}

export async function consumeRabbitTaskSubmissionsService() {
    try {
        await ensureConnectionAndChannel();
        if (channel) {
            const parentalApprovalQueueConfig = rabbitmqConfig.queues[TASK_SUBMISSION_QUEUE_NAME] || { name: TASK_SUBMISSION_QUEUE_NAME, options: { durable: true } };
            const assertedQueue = await channel.assertQueue(parentalApprovalQueueConfig.name, parentalApprovalQueueConfig.options);
            console.log(`Esperando mensajes en la cola "${assertedQueue.queue}"...`);

            channel.consume(assertedQueue.queue, async (msg) => {
                if (msg) {
                    try {
                        const taskSubmissionEvent = JSON.parse(msg.content.toString());
                        console.log('Evento de subida de tarea recibido:', taskSubmissionEvent);

                        await handleTaskEvent(taskSubmissionEvent);

                        channel.ack(msg);
                    } catch (error) {
                        console.error('Error al procesar el mensaje:', error);
                    }
                }
            }, { noAck: false });
            console.log(`[CLIENTE] Esperando mensajes en la cola "${assertedQueue.queue}"...`);

        } else {
            console.error("No se pudo iniciar el consumidor: canal no disponible.");
        }

    } catch (error) {
        console.error("Error al conectar o consumir mensajes:", error);
    } finally {
        // Se mantiene el microservicio activo
        console.log("Conexión a RabbitMQ establecida y (re)intentando consumir mensajes...");
    }
}

consumeRabbitTaskSubmissionsService().catch(console.error);