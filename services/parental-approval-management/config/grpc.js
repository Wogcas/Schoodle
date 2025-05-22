import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GRPC_PORT } from '../utils/config.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export function startGrpcServer(serviceImplementation) {
    // Cargar el archivo proto
    const packageDefinition = protoLoader.loadSync(
        path.join(__dirname, '../protos', 'tasks-parental-approval-management.proto'),
        {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        });

    // Instantiate the gRPC service implementation, injecting the data source
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
    const serviceDefinition = protoDescriptor.parentalapprovalmanagement.ParentalApprovalManagementGrpcService.service;

    // 3. Crear instancia del servidor
    const grpcServer = new grpc.Server();

    // 4. Registrar el servicio
    grpcServer.addService(serviceDefinition, serviceImplementation);

    const certPath = path.resolve(__dirname, '../certs/cert.pem');
    const keyPath = path.resolve(__dirname, '../certs/key.pem');

    // Configuración TLS simplificada
    const serverCredentials = grpc.ServerCredentials.createSsl(null, [{
        private_key: fs.readFileSync(keyPath),
        cert_chain: fs.readFileSync(certPath),
    }], false);

    return {
        start: (port = GRPC_PORT) => {
            grpcServer.bindAsync(
                `0.0.0.0:${port}`,
                serverCredentials,
                (err, boundPort) => {
                    if (err) throw err;
                    console.log(`Servidor gRPC seguro en puerto ${boundPort}`);
                }
            );
        }
    };
}


