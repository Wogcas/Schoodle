# Usa una imagen oficial de Node.js como base
FROM node:18-alpine

# Crea el directorio de la aplicación
WORKDIR /usr/src/app

# Copia los archivos de configuración del proyecto
COPY package*.json ./
COPY knexfile.js ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto que usa Express (ajusta el 3000 si usas otro)
EXPOSE 3004

# Comando para iniciar la aplicación
CMD ["npm", "start"]