import { HTTP_PORT } from './utils/config.js';
import { createHttpServer } from './config/express.js';
import ParentalApprovalServiceAdapter from './services/grpc/ParentalApprovalServiceAdapter.js'
import ParentalApprovalService from './services/grpc/ParentalApprovalService.js';
import { startGrpcServer } from './config/grpc.js';
import {
    consumeRabbitTaskSubmissionsService,
    publishTaskSubmissionEvent
}
    from './services/consumeRabbitTaskSubmissionService.js';



// Configurar e iniciar servidor HTTP
const httpServer = createHttpServer();

// Iniciar servidor gRPC
const adapter = new ParentalApprovalServiceAdapter(new ParentalApprovalService());
startGrpcServer(adapter);

// Iniciar consumidor RabbitMQ
const initializeRabbitMQ = async () => {
    try {
        await consumeRabbitTaskSubmissionsService();
        await publishTaskSubmissionEvent({ taskId: 1, status: 'submitted' });
    } catch (error) {
        console.error('Error inicializando RabbitMQ:', error);
        process.exit(1);
    }
};

httpServer.listen(HTTP_PORT, () => {
    console.log(`Servidor HTTP escuchando en puerto ${HTTP_PORT}`);
    initializeRabbitMQ();
});