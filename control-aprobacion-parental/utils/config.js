import dotenv from 'dotenv';

dotenv.config();

export const HTTP_PORT = process.env.HTTP_PORT || 3005;
export const GRPC_PORT = process.env.GRPC_PORT || 50051;
