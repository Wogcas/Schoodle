import { AppDataSource } from '../data-base/AppDataSource.js';
import { TaskSchema } from '../Entity/Task.js';

/**
 * Clase de acceso a datos para la entidad Task
 * Proporciona métodos específicos para operaciones de acceso a datos
 * y actúa como una capa intermedia entre el repositorio y la lógica de negocio
 */
export class TaskDAO {
    constructor() {
        this.taskRepository = AppDataSource.getRepository(TaskSchema);
    }
    /**
     * Obtiene todas las tareas
     * @returns {Promise<Task[]>} Lista de tareas
     */
    async getAllTasks() {
        try {
            return await this.taskRepository.find();
        } catch (error) {
            console.error('Error al obtener todas las tareas:', error);
            throw new Error('No se pudieron recuperar las tareas');
        }
    }

    /**
     * Obtiene una tarea por su ID
     * @param {string} id - ID de la tarea
     * @returns {Promise<Task|null>} La tarea encontrada o null si no existe
     */
    async getTaskById(id) {
        try {
            const task = await this.taskRepository.findById(id);
            if (!task) {
                return null;
            }
            return task;
        } catch (error) {
            console.error(`Error al obtener la tarea con ID ${id}:`, error);
            throw new Error(`No se pudo recuperar la tarea con ID ${id}`);
        }
    }

    /**
     * Obtiene tareas por estado
     * @param {string} status - Estado de las tareas a buscar (PENDING, APPROVED, REJECTED)
     * @returns {Promise<Task[]>} Lista de tareas con el estado especificado
     */
    async getTasksByStatus(status) {
        try {
            return await this.taskRepository.findByStatus(status);
        } catch (error) {
            console.error(`Error al obtener tareas con estado ${status}:`, error);
            throw new Error(`No se pudieron recuperar las tareas con estado ${status}`);
        }
    }

    /**
     * Obtiene tareas pendientes asignadas a un usuario específico
     * @param {string} userId - ID del usuario
     * @returns {Promise<Task[]>} Lista de tareas pendientes del usuario
     */
    async getPendingTasksByUserId(userId) {
        try {
            return await this.taskRepository.findPendingTasksByUserId(userId);
        } catch (error) {
            console.error(`Error al obtener tareas pendientes del usuario ${userId}:`, error);
            throw new Error(`No se pudieron recuperar las tareas pendientes del usuario ${userId}`);
        }
    }

    /**
     * Crea una nueva tarea
     * @param {Object} taskData - Datos de la tarea a crear
     * @returns {Promise<Task>} La tarea creada
     */
    async createTask(taskData) {
        try {
            // Validaciones básicas
            if (!taskData.nombre) {
                throw new Error('El nombre de la tarea es obligatorio');
            }

            return await this.taskRepository.create(taskData);
        } catch (error) {
            console.error('Error al crear la tarea:', error);
            throw error;
        }
    }

    /**
     * Actualiza una tarea existente
     * @param {string} id - ID de la tarea a actualizar
     * @param {Object} taskData - Nuevos datos de la tarea
     * @returns {Promise<Task>} La tarea actualizada
     */
    async updateTask(id, taskData) {
        try {
            // Verificar que la tarea existe
            const existingTask = await this.taskRepository.findById(id);
            if (!existingTask) {
                throw new Error(`No existe una tarea con ID ${id}`);
            }

            return await this.taskRepository.update(id, taskData);
        } catch (error) {
            console.error(`Error al actualizar la tarea con ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Actualiza solo el estado de una tarea
     * @param {string} id - ID de la tarea a actualizar
     * @param {string} status - Nuevo estado (PENDING, APPROVED)
     * @returns {Promise<Task>} La tarea actualizada
     */
    async updateTaskStatus(id, status) {
        try {
            // Validar que el estado sea válido
            const validStatuses = ['PENDING', 'APPROVED'];
            if (!validStatuses.includes(status)) {
                throw new Error(`Estado inválido: ${status}. Debe ser uno de: ${validStatuses.join(', ')}`);
            }

            // Verificar que la tarea existe
            const existingTask = await this.taskRepository.findById(id);
            if (!existingTask) {
                throw new Error(`No existe una tarea con ID ${id}`);
            }

            return await this.taskRepository.updateStatus(id, status);
        } catch (error) {
            console.error(`Error al actualizar el estado de la tarea con ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Elimina una tarea
     * @param {string} id - ID de la tarea a eliminar
     * @returns {Promise<boolean>} true si se eliminó correctamente
     */
    async deleteTask(id) {
        try {
            // Verificar que la tarea existe
            const existingTask = await this.taskRepository.findById(id);
            if (!existingTask) {
                throw new Error(`No existe una tarea con ID ${id}`);
            }

            return await this.taskRepository.delete(id);
        } catch (error) {
            console.error(`Error al eliminar la tarea con ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Busca tareas por nombre (búsqueda parcial)
     * @param {string} nombre - Texto para buscar en el nombre de la tarea
     * @returns {Promise<Task[]>} Lista de tareas que coinciden con la búsqueda
     */
    async searchTasksByName(nombre) {
        try {
            const allTasks = await this.taskRepository.findAll();
            // Filtrar tareas que contienen el texto buscado en su nombre (case insensitive)
            return allTasks.filter(task =>
                task.nombre.toLowerCase().includes(nombre.toLowerCase())
            );
        } catch (error) {
            console.error(`Error al buscar tareas por nombre "${nombre}":`, error);
            throw new Error(`No se pudieron buscar tareas con nombre "${nombre}"`);
        }
    }

    /**
     * Cuenta las tareas por estado
     * @returns {Promise<Object>} Objeto con contadores por estado
     */
    async countTasksByStatus() {
        try {
            const allTasks = await this.taskRepository.findAll();
            const counts = {
                PENDING: 0,
                APPROVED: 0,
                TOTAL: allTasks.length
            };

            // Contar tareas por estado
            allTasks.forEach(task => {
                if (counts.hasOwnProperty(task.status)) {
                    counts[task.status]++;
                }
            });

            return counts;
        } catch (error) {
            console.error('Error al contar tareas por estado:', error);
            throw new Error('No se pudieron contar las tareas por estado');
        }
    }

    /**
     * Obtiene tareas cercanas a la fecha de vencimiento
     * @param {number} daysThreshold - Número de días para considerar como "cercano"
     * @returns {Promise<Task[]>} Lista de tareas próximas a vencer
     */
    async getTasksNearDueDate(daysThreshold = 3) {
        try {
            const allTasks = await this.taskRepository.findAll();
            const now = new Date();
            const thresholdMs = daysThreshold * 24 * 60 * 60 * 1000; // Convertir días a milisegundos

            // Filtrar tareas que vencen pronto y que estén pendientes
            return allTasks.filter(task => {
                if (!task.dueDate || task.status !== 'PENDING') return false;

                const dueDate = new Date(task.dueDate);
                const timeRemaining = dueDate.getTime() - now.getTime();
                return timeRemaining > 0 && timeRemaining <= thresholdMs;
            });
        } catch (error) {
            console.error(`Error al buscar tareas próximas a vencer (${daysThreshold} días):`, error);
            throw new Error('No se pudieron obtener las tareas próximas a vencer');
        }
    }
}