import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GRPC_PORT } from '../utils/config';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export function startGrpcServer(serviceImplementation) {
    // Cargar el archivo proto
    const packageDefinition = protoLoader.loadSync(
        path.join(__dirname, 'protos', 'tasks-parental-approval-management.proto'),
        {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        });

    // Instantiate the gRPC service implementation, injecting the data source
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).parentalapprovalmanagement;
    const parentalApprovalManagementProto = protoDescriptor.parentalapproval;

    // 2. gRPC server instance
    const grpcServer = new grpc.Server();

    // 3. Add the gRPC service and its implementation
    grpcServer.addService(
        parentalApprovalManagementProto.ParentalApprovalManagementGrpcService.service,
        serviceImplementation
    );

    // Configuración TLS simplificada
    const serverCredentials = grpc.ServerCredentials.createSsl(null, [{
        private_key: fs.readFileSync('./key.pem'),
        cert_chain: fs.readFileSync('./cert.pem'),
    }], false);

    return {
        start: (GRPC_PORT) => {
            server.bindAsync(
                `0.0.0.0:${GRPC_PORT}`,
                serverCredentials,
                (err, GRPC_PORT) => {
                    if (err) throw err;
                    console.log(`Servidor gRPC seguro (autofirmado) en puerto ${GRPC_PORT}`);
                    server.start();
                }
            );
        }
    };
}
