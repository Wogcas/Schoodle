import { DataSource } from 'typeorm';
import { TaskSchema } from '../Entity/Task.js';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "cinco123",
    database: "parentalApprovalManagementDB",
    synchronize: false,
    logging: true,
    entities: [TaskSchema],
    subscribers: [],
    migrations: [],
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source inicializado correctamente...");
    })
    .catch((err) => {
        console.error("Error al inicializar Data Source:", err);
    });
