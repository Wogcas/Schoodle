import { Router } from 'express';
import { messageController } from '../controllers/messageController';

const router = Router();

// Obtener historial de mensajes entre un padre y un maestro
router.get('/history/:parentId/:teacherId', messageController.getMessageHistory);

// Marcar mensajes como leídos
router.put('/:messageId/read', messageController.markAsRead);


// Obtener configuración STOMP
router.get('/stomp-config', messageController.getStompConfig);

export { router as messageRouter };