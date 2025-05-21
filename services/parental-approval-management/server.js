import express from 'express';
import { HTTP_PORT, GRPC_PORT } from './utils/config.js';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import parentalApprovalManagementRouter from './routers/parentalApprovalManagementRouter.js';
import path from 'path';
import { fileURLToPath } from 'url'; // Importa 'fileURLToPath'
import ParentalApprovalManagementGrpcService from './services/parentalApprovalManagementGrpcService.js';
import ExternalTaskDataSource from './services/parentalApprovalManagementExpressService.js';
import { consumeRabbitTaskSubmissionsService, publishTaskSubmissionEvent } from './services/consumeRabbitTaskSubmissionService.js';
const __filename = fileURLToPath(import.meta.url); // Obtén la ruta del archivo actual
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Express Routes
app.use('/parental-approval', parentalApprovalManagementRouter);

// Start the HTTP Express server
app.listen(HTTP_PORT, () => {
    console.log(`Express server listening on port ${HTTP_PORT}`);
});

// --- gRPC server configuration and startup ---

// 1. Load the service definition from the .proto file
const packageDefinition = protoLoader.loadSync(
    path.join(__dirname + '/protos/tasks-parental-approval-management.proto'),
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
const parentalApprovalManagementProto = grpc.loadPackageDefinition(packageDefinition).parentalapprovalmanagement;

// Instantiate the concrete data source implementation
const taskDataSource = new ExternalTaskDataSource();

// Instantiate the gRPC service implementation, injecting the data source
const parentalApprovalManagementGrpcServiceImpl = new ParentalApprovalManagementGrpcService(taskDataSource)

// 2. gRPC server instance
const grpcServer = new grpc.Server();

// 3. Add the gRPC service and its implementation
grpcServer.addService(
    parentalApprovalManagementProto.ParentalApprovalManagementGrpcService.service,
    parentalApprovalManagementGrpcServiceImpl
);

// 4. Bind the gRPC server to the address and port
grpcServer.bindAsync(
    `localhost:${GRPC_PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) {
            console.error('Error binding gRPC server:', err);
            return;
        }
        console.log(`gRPC server listening on port ${port}`);
    }
);

// --- Iniciar el consumidor de RabbitMQ ---
consumeRabbitTaskSubmissionsService().catch(err => console.error("Error al iniciar el consumidor de RabbitMQ:", err));
publishTaskSubmissionEvent({ taskId: 1, status: 'submitted' }).catch(err => console.error("Error al publicar el evento de RabbitMQ:", err));
