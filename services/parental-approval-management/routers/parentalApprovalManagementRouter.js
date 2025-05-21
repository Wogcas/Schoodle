/**
 * @module parentalApprovalManagementRouter
 * Router that handles HTTP requests related to parental approval management.
 */
import { Router } from 'express';
import TaskDataSource from '../data-base/TaskDataSource.js';

const parentalApprovalManagementRouter = Router();
const taskDataSource = new TaskDataSource();

// 1. Obtener información del sitio
parentalApprovalManagementRouter.get('/site-info', async (req, res) => {
    try {
        const siteInfo = await taskDataSource.getSiteInfo();
        return res.status(200).json(siteInfo);
    } catch (error) {
        console.error('Error al obtener información del sitio:', error);
        return res.status(500).json({ error: 'No se pudo obtener la información del sitio' });
    }
});

// 2. Obtener todas las tareas (usando getAllTasks de la DAO directamente)
parentalApprovalManagementRouter.get('/tasks', async (req, res) => {
    try {
        const tasks = await taskDataSource.taskDAO.getAllTasks(); // Accediendo directamente a la DAO
        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Error al obtener todas las tareas:', error);
        return res.status(500).json({ error: 'No se pudieron recuperar las tareas' });
    }
});

// 3. Obtener tareas pendientes para un padre (ejemplo de uso de lógica en TaskDataSource)
parentalApprovalManagementRouter.get('/parents/:parentId/pending-tasks', async (req, res) => {
    const { parentId } = req.params;
    try {
        const pendingTasks = await taskDataSource.getPendingTasks(parentId);
        return res.status(200).json(pendingTasks);
    } catch (error) {
        console.error('Error al obtener tareas pendientes:', error);
        return res.status(500).json({ error: 'No se pudieron obtener las tareas pendientes' });
    }
});

// 4. Obtener detalles de una tarea por ID
parentalApprovalManagementRouter.get('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    try {
        const taskDetails = await taskDataSource.getTaskDetails(taskId);
        if (!taskDetails) {
            return res.status(404).json({ message: `Tarea con ID ${taskId} no encontrada` });
        }
        return res.status(200).json(taskDetails);
    } catch (error) {
        console.error('Error al obtener detalles de la tarea:', error);
        return res.status(500).json({ error: 'No se pudieron obtener los detalles de la tarea' });
    }
});

// 5. Aprobar una tarea
parentalApprovalManagementRouter.post('/tasks/:taskId/approve', async (req, res) => {
    const { taskId } = req.params;
    // Aquí podrías extraer información del usuario autenticado (el padre)
    const parentId = 'parent123'; // Simulación del ID del padre
    try {
        const approvalResult = await taskDataSource.approveTask(taskId, parentId);
        return res.status(200).json(approvalResult);
    } catch (error) {
        console.error('Error al aprobar la tarea:', error);
        return res.status(500).json({ error: 'No se pudo aprobar la tarea' });
    }
});

// 6. Rechazar una tarea
parentalApprovalManagementRouter.post('/tasks/:taskId/reject', async (req, res) => {
    const { taskId } = req.params;
    const { reason } = req.body; // Espera una razón en el cuerpo de la petición
    const parentId = 'parent123'; // Simulación del ID del padre
    try {
        const rejectionResult = await taskDataSource.rejectTask(taskId, parentId, reason);
        return res.status(200).json(rejectionResult);
    } catch (error) {
        console.error('Error al rechazar la tarea:', error);
        return res.status(500).json({ error: 'No se pudo rechazar la tarea' });
    }
});

// 7. Obtener tareas cercanas a la fecha de vencimiento
parentalApprovalManagementRouter.get('/tasks/near-due-date', async (req, res) => {
    try {
        const nearDueTasks = await taskDataSource.getTasksNearDueDate();
        return res.status(200).json(nearDueTasks);
    } catch (error) {
        console.error('Error al obtener tareas próximas a vencer:', error);
        return res.status(500).json({ error: 'No se pudieron obtener las tareas próximas a vencer' });
    }
});

// 8. Obtener estadísticas de tareas
parentalApprovalManagementRouter.get('/tasks/statistics', async (req, res) => {
    try {
        const statistics = await taskDataSource.getTaskStatistics();
        return res.status(200).json(statistics);
    } catch (error) {
        console.error('Error al obtener estadísticas de tareas:', error);
        return res.status(500).json({ error: 'No se pudieron obtener las estadísticas de tareas' });
    }
});

export default parentalApprovalManagementRouter;