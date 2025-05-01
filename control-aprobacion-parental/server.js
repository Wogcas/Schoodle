import express from 'express';
import { HTTP_PORT, GRPC_PORT } from './utils/config';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import parentalApprovalManagementRouter from './routers/parentalApprovalManagementRouter';
import parentalApprovalManagementGrpcService from './services/parentalApprovalManagementGrpcService';


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
    __dirname + '../../gestor-tarea-aprobacion-parental.proto',
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
const parentalApprovalManagementProto = grpc.loadPackageDefinition(packageDefinition).parentalapprovalmanagement;

// 2. gRPC server instance
const grpcServer = new grpc.Server();

// 3. Add the gRPC service and its implementation
grpcServer.addService(
    parentalApprovalManagementProto.ParentalApprovalManagementGrpcService.service,
    parentalApprovalManagementGrpcService
);

// 4. Bind the gRPC server to the address and port
grpcServer.bindAsync(
    `0.0.0.0:${GRPC_PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) {
            console.error('Error binding gRPC server:', err);
            return;
        }
        console.log(`gRPC server listening on port ${port}`);
    }
);