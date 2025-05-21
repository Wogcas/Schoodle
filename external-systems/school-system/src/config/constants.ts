import path from 'path';
import { config } from 'dotenv';

config();

const rootDir = path.resolve(__dirname, '../../');

function resolveEnvPath(envVar: string | undefined, fallback: string) {
  if (!envVar) return path.join(rootDir, fallback);
  return path.isAbsolute(envVar) ? envVar : path.join(rootDir, envVar);
}

export const SERVER_PORT: number = parseInt(process.env.SERVER_PORT || '3004', 10);
export const SERVER_HOST: string = process.env.SERVER_HOST || '0.0.0.0';
export const HTTP_PORT: number = parseInt(process.env.HTTP_PORT || '3004', 10);
export const HTTPS_PORT: number = parseInt(process.env.HTTPS_PORT || '3004', 10);

export const SSL_KEY_PATH: string = resolveEnvPath(process.env.SSL_KEY_PATH, 'ssl/server.key');
export const SSL_CERT_PATH: string = resolveEnvPath(process.env.SSL_CERT_PATH, 'ssl/server.crt');