import { Router } from 'express';
import { MessageController } from '../controllers/messageController';

export const createMessageRouter = (messageControllerInstance: MessageController): Router => {
    const router = Router();

    // Ruta para obtener el historial de mensajes entre dos usuarios
    router.get('/history/:user1Id/:user2Id', messageControllerInstance.getMessageHistory);

    // Ruta para marcar un mensaje como leído
    router.post('/:messageId/read',messageControllerInstance.markAsRead);

    // Ruta para obtener la configuración de STOMP
    router.get('/stomp-config', messageControllerInstance.getStompConfig);

    return router;
};
