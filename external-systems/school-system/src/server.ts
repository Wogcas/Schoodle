import 'dotenv/config';
import app from './app';
import https from 'https';
import fs from 'fs';
import { 
  SERVER_HOST, 
  HTTPS_PORT, 
  SSL_KEY_PATH, 
  SSL_CERT_PATH,
  HTTP_PORT 
} from './config/constants';
import express from 'express';

// Configuración SSL
const sslOptions = {
  key: fs.readFileSync(SSL_KEY_PATH),
  cert: fs.readFileSync(SSL_CERT_PATH)
};

// Servidor HTTPS principal
const httpsServer = https.createServer(sslOptions, app);

httpsServer.listen(HTTPS_PORT, SERVER_HOST, () => {
  console.log(`🚀 Secure server running on https://${SERVER_HOST}:${HTTPS_PORT}`);
});

// Redirección HTTP (Opcional para producción)
if (process.env.NODE_ENV === 'production') {
  const httpApp = express();
  
  httpApp.all('*', (req, res) => {
    const host = req.headers.host?.includes('localhost') 
      ? `${SERVER_HOST}:${HTTPS_PORT}` 
      : req.headers.host;
    
    res.redirect(`https://${host}${req.url}`);
  });

  httpApp.listen(HTTP_PORT, () => {
    console.log(`🔗 HTTP redirect server running on port ${HTTP_PORT}`);
  });
}