import express, { Request, Response } from 'express';
import { SERVER_PORT, SERVER_HOST, HTTPS_PORT } from './config/constants';
import systemRoutes from './routes/system';
import studentRoutes from './routes/student';
import teacherRoutes from './routes/teacher';
import userRoutes from './routes/user';
import schoolTermRoutes from './routes/schoolTerm';
import gradeRoutes from './routes/grade';
import violationRoutes from './routes/violation';
import courseRoutes from './routes/course';

const app = express();

app.use(express.json());

// Ruta principal con tipos explícitos
app.get('/', (req: Request, res: Response) => {
  res.send(`
    <h1>School System API</h1>
    <p>Welcome to the School System API! call <a href="https://${SERVER_HOST}:${HTTPS_PORT}/api/school-system/info">
      https://${SERVER_HOST}:${HTTPS_PORT}/api/school-system/info to get system information.
    </a></p>
  `);
});

app.use('/api/school-system', systemRoutes);
app.use('/api/school-system/students', studentRoutes );
app.use('/api/school-system/teachers', teacherRoutes );
app.use('/api/school-system/users', userRoutes );
app.use('/api/school-system/school-terms', schoolTermRoutes );
app.use('/api/school-system/grades', gradeRoutes);
app.use('/api/school-system/violations', violationRoutes);
app.use('/api/school-system/courses', courseRoutes);

export default app;
