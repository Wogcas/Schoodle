import { TaskDAO } from "../DAOs/TaskDAO";

class TaskDataSource {
    constructor() {
        this.taskDAO = new TaskDAO();
    }

    async getSiteInfo() {
        return {
            siteName: 'Parental Approval Management System',
            version: '1.0.0',
            description: 'Sistema de gestión de aprobaciones parentales'
        };
    }

    async getPendingTasks(parentId) {
        try {
            // Obtener tareas pendientes asignadas al usuario hijo del padre
            // Aquí deberías tener una lógica para relacionar el parentId con sus hijos
            // Por ahora, solo simulamos la respuesta
            const tasks = await this.taskDAO.getTasksByStatus('PENDING');

            return tasks.map(task => ({
                id: task.id,
                title: task.nombre,
                studentName: 'Estudiante A', // Esto debería venir de otra entidad de usuario
                description: task.description,
                dueDate: task.dueDate
            }));
        } catch (error) {
            console.error('Error al obtener tareas pendientes:', error);
            throw error;
        }
    }

    async getTaskDetails(taskId) {
        try {
            const task = await this.taskDAO.getTaskById(taskId);
            if (!task) {
                throw new Error(`Tarea con ID ${taskId} no encontrada`);
            }

            return {
                id: task.id,
                title: task.nombre,
                description: task.description,
                assignedUserId: task.assignedUserId,
                dueDate: task.dueDate,
                creationDate: task.createdAt,
                status: task.status
            };
        } catch (error) {
            console.error('Error al obtener detalles de la tarea:', error);
            throw error;
        }
    }

    async approveTask(taskId, parentId) {
        try {
            // Verificar que la tarea existe
            const task = await this.taskDAO.getTaskById(taskId);
            if (!task) {
                throw new Error(`Tarea con ID ${taskId} no encontrada`);
            }

            // Aquí deberíamos verificar que el padre tiene autorización para aprobar esta tarea
            // Por ejemplo, verificando que el estudiante asignado es hijo del padre

            // Actualizar el estado de la tarea a 'APPROVED'
            await this.taskDAO.updateTaskStatus(taskId, 'APPROVED');

            return {
                success: true,
                message: `Tarea "${task.nombre}" aprobada exitosamente`
            };
        } catch (error) {
            console.error('Error al aprobar la tarea:', error);
            throw error;
        }
    }

    async rejectTask(taskId, parentId, reason) {
        try {
            const task = await this.taskDAO.getTaskById(taskId);
            if (!task) {
                throw new Error(`Tarea con ID ${taskId} no encontrada`);
            }

            // Actualizar el estado de la tarea a 'REJECTED'
            await this.taskDAO.updateTaskStatus(taskId, 'REJECTED');

            // Aquí podrías guardar la razón del rechazo en otra tabla

            return {
                success: true,
                message: `Tarea "${task.nombre}" rechazada`
            };
        } catch (error) {
            console.error('Error al rechazar la tarea:', error);
            throw error;
        }
    }

    async getTasksNearDueDate() {
        try {
            const tasks = await this.taskDAO.getTasksNearDueDate(3); // Tareas que vencen en 3 días o menos

            return tasks.map(task => ({
                id: task.id,
                title: task.nombre,
                description: task.description,
                dueDate: task.dueDate,
                status: task.status
            }));
        } catch (error) {
            console.error('Error al obtener tareas próximas a vencer:', error);
            throw error;
        }
    }

    async getTaskStatistics() {
        try {
            return await this.taskDAO.countTasksByStatus();
        } catch (error) {
            console.error('Error al obtener estadísticas de tareas:', error);
            throw error;
        }
    }
}

export default TaskDataSource;