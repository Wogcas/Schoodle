import fs from 'fs';
import path from 'path';

const SSL_CERTS_PATH = path.join(process.cwd(), 'certs');

export const HTTPS_OPTIONS = {
    key: fs.readFileSync(path.join(SSL_CERTS_PATH, 'server.key')),
    cert: fs.readFileSync(path.join(SSL_CERTS_PATH, 'server.cert')),
    rejectUnauthorized: false
};