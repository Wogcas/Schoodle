import express from 'express';
import { SERVER_PORT, SERVER_HOST } from './config/constants';
import systemRoutes from './routes/system';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`Welcome to the School System API! call http://${SERVER_HOST}:${SERVER_PORT}/api/school-system/info to get system information.`);
});

app.use('/api/school-system', systemRoutes);

export default app;
