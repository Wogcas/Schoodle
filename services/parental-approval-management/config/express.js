import express from 'express';
import parentalApprovalManagementRouter from '../routers/parentalApprovalManagementRouter.js';
import { HTTPS_OPTIONS } from './ssl-config.js';
import { createServer } from 'http';

export function createHttpServer() {

    const app = express();
    app.use(express.json());

    // Middleware y rutas
    app.use('/parental-approval', parentalApprovalManagementRouter);


    return createServer(HTTPS_OPTIONS, app);
}