import { DataSource } from "typeorm";
import 'dotenv/config'
import { Conversation } from "../entities/conversation";
import { Message } from "../entities/message";


export const contextDB = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    dropSchema: false,
    logging: ["error"],
    entities: [
        Conversation,
        Message,
    ]
});

/**
 
async function connectAndClose() {
    try {
        // Inicializa la conexión
        await contextDB.initialize();
        console.log("Conexión a la base de datos establecida");
        // Aquí irían las operaciones con la base de datos
        
    } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
    } finally {
        // Cierra la conexión una vez terminada la operación
        await contextDB.destroy();
        console.log("Conexión cerrada");
    }
}


connectAndClose();
*/