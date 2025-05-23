// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs' // Importar fs
import path from 'path' // Importar path

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/server.key')), // Ajusta la ruta
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/server.crt')), // Ajusta la ruta
    },
  }
})