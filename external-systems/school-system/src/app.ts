import express from 'express';
import { SERVER_PORT, SERVER_HOST } from './config/constants';
import systemRoutes from './routes/system';
import studentRoutes from './routes/student';
import teacherRoutes from './routes/teacher';
import userRoutes from './routes/user';
import schoolTermRoutes from './routes/schoolTerm';
import gradeRoutes from './routes/grade';
import violationRoutes from './routes/violation';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`Welcome to the School System API! call http://${SERVER_HOST}:${SERVER_PORT}/api/school-system/info to get system information.`);
});

app.use('/api/school-system', systemRoutes);
app.use('/api/school-system/students', studentRoutes );
app.use('/api/school-system/teachers', teacherRoutes );
app.use('/api/school-system/users', userRoutes );
app.use('/api/school-system/school-terms', schoolTermRoutes );
app.use('/api/school-system/grades', gradeRoutes);
app.use('/api/school-system/violations', violationRoutes);

export default app;
