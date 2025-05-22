import express from 'express';
import parentalApprovalManagementRouter from '../routers/parentalApprovalManagementRouter.js';
import { HTTPS_OPTIONS } from './ssl-config.js';
import { HTTP_PORT } from '../utils/config.js';
import { createServer } from 'http';

export function createHttpServer() {

    const app = express();
    app.use(express.json());

    // Middleware y rutas
    app.use('/parental-approval', parentalApprovalManagementRouter);

    // Start the HTTP Express server
    server.listen(HTTP_PORT, () => {
        console.log(`Express server listening on port ${HTTP_PORT}`);
    });

    return createServer(HTTPS_OPTIONS, app);
}