# Usa una imagen oficial de Node.js como base
FROM node:18-alpine

# Crea el directorio de la aplicación
WORKDIR /usr/src/app

# Copia los archivos de configuración del proyecto
COPY package*.json ./
COPY tsconfig.json ./
COPY knexfile.js ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto que usa Express
EXPOSE 3004

# Comando para iniciar la aplicación con ts-node
CMD ["npm", "run", "dev"]