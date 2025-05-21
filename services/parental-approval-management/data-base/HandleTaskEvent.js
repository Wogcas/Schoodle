import { TaskDAO } from "../DAOs/TaskDAO.js";

// Instancia del DAO para operaciones con tareas
const taskDAO = new TaskDAO();

/**
 * Procesa un evento de tarea y lo guarda en la base de datos
 * @param {Object} taskSubmissionEvent - Evento de tarea recibido de RabbitMQ
 * @returns {Promise<Object>} Resultado de la operación
 */

export async function handleTaskEvent(rawEvent) {
    try {
        console.log('Evento recibido:', rawEvent);
        
        // Validación básica
        if (!rawEvent || !rawEvent.assignmentName) {
            throw new Error('Evento inválido: falta assignmentName');
        }

        // Mapeo de campos
        const taskData = {
            name: rawEvent.assignmentName, // Mapeamos assignmentName -> name
            status: 'PENDING', // Valor por defecto
            assignmentId: rawEvent.assignmentId,
            userId: rawEvent.userId,
            course: rawEvent.course,
            timeModified: (rawEvent.timeModified && !isNaN(new Date(rawEvent.timeModified))) 
                ? new Date(rawEvent.timeModified) 
                : new Date()
        };

        console.log('Datos mapeados para BD:', taskData);
        
        const createdTask = await taskDAO.createTask(taskData);
        console.log('Tarea creada con ID:', createdTask.id);
        
        return {
            success: true,
            taskId: createdTask.id
        };
    } catch (error) {
        console.error('Error detallado:', {
            message: error.message,
            stack: error.stack,
            receivedEvent: rawEvent
        });
        throw error;
    }
}

// Modificación del consumidor RabbitMQ para usar handleTaskEvent
export async function consumeRabbitTaskSubmissionsService() {
    try {
        await ensureConnectionAndChannel();
        if (channel) {
            const parentalApprovalQueueConfig = rabbitmqConfig.queues[TASK_SUBMISSION_QUEUE_NAME] || { 
                name: TASK_SUBMISSION_QUEUE_NAME, 
                options: { durable: true } 
            };
            
            const assertedQueue = await channel.assertQueue(
                parentalApprovalQueueConfig.name, 
                parentalApprovalQueueConfig.options
            );
            
            console.log(`Esperando mensajes en la cola "${assertedQueue.queue}"...`);

            channel.consume(assertedQueue.queue, async (msg) => {
                if (msg) {
                    try {
                        const taskSubmissionEvent = JSON.parse(msg.content.toString());
                        console.log('Evento de subida de tarea recibido:', taskSubmissionEvent);

                        // Procesar el evento usando handleTaskEvent
                        await handleTaskEvent(taskSubmissionEvent);
                        
                        channel.ack(msg);
                    } catch (error) {
                        console.error('Error al procesar el mensaje:', error);
                        // Opcional: enviar el mensaje a una cola de errores
                        channel.nack(msg, false, false);
                    }
                }
            }, { noAck: false });

        } else {
            console.error("No se pudo iniciar el consumidor: canal no disponible.");
        }
    } catch (error) {
        console.error("Error al conectar o consumir mensajes:", error);
    } finally {
        console.log("Conexión a RabbitMQ establecida y (re)intentando consumir mensajes...");
    }
}