import { Request, Response } from 'express';
import ChatService from '../services/chatService';
import { NotificationPublisherService } from '../rabbit/notificationsRabbit';

export class MessageController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService(new NotificationPublisherService());
    this.getMessageHistory = this.getMessageHistory.bind(this);
    this.markAsRead = this.markAsRead.bind(this);
    this.getStompConfig = this.getStompConfig.bind(this);
  }

  // Obtener historial de mensajes
  async getMessageHistory(req: Request, res: Response): Promise<void> {
    try {
      const { user1, user2 } = req.params;

      if (!user1 || !user2) {
        res.status(400).json({ error: 'Se requieren IDs de usuario 1 y usuario 2' });
        return;
      }

      const messages = this.chatService.getMessageHistory(user1, user2);
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

      const success = this.chatService.markMessageAsRead(messageId);
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


  // Obtener información de conexión WebSTOMP
  getStompConfig(req: Request, res: Response): void {
    try {
      const stompUrl = this.chatService.getWebStompURL();
      console.log('Configuración STOMP:', stompUrl);
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