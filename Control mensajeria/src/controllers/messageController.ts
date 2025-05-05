import { Request, Response } from 'express';
import { chatService } from '../services/chatService';

export class MessageController {

  // Obtener historial de mensajes
  async getMessageHistory(req: Request, res: Response): Promise<void> {
    try {
      const { parentId, teacherId } = req.params;

      if (!parentId || !teacherId) {
        res.status(400).json({ error: 'Se requieren IDs de padre y maestro' });
        return;
      }

      const messages = chatService.getMessageHistory(parentId, teacherId);
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error al obtener historial de mensajes:', error);
      res.status(500).json({ error: 'Error al obtener mensajes' });
    }
  }


  // Marcar mensaje como leído
  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { messageId } = req.params;

      if (!messageId) {
        res.status(400).json({ error: 'Se requiere ID del mensaje' });
        return;
      }

      const success = chatService.markMessageAsRead(messageId);
      if (!success) {
        res.status(404).json({ error: 'Mensaje no encontrado' });
        return;
      }

      res.status(200).json({ status: 'success' });
    } catch (error) {
      console.error('Error al marcar mensaje como leído:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Configurar cola para un usuario
  async setupUserQueue(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({ error: 'Se requiere ID del usuario' });
        return;
      }

      const queueName = await chatService.setupUserQueue(userId);
      res.status(200).json({
        queueName,
        status: 'success'
      });
    } catch (error) {
      console.error('Error al configurar cola para usuario:', error);
      res.status(500).json({ error: 'Error al configurar cola' });
    }
  }

  // Obtener información de conexión WebSTOMP
  getStompConfig(req: Request, res: Response): void {
    try {
      const stompUrl = chatService.getWebStompURL();
      res.status(200).json({
        stompUrl,
        exchange: 'chat_exchange', 
        status: 'success'
      });
    } catch (error) {
      console.error('Error al obtener configuración STOMP:', error);
      res.status(500).json({ error: 'Error al obtener configuración' });
    }
  }
}

export const messageController = new MessageController();
export default messageController;