import { Request, Response } from 'express';
import ChatService, { ConversationListItemDto } from '../services/chatService'; // Importar DTO
import { MessageDto } from '../types/messageDTO';


interface CustomRequest extends Request {
    body: {
        userIdMakingRequest?: string;
    } & Request['body'];
     user?: { 
        id: string;
    };
}

export class MessageController {
    private chatService: ChatService;

    constructor(chatServiceInstance: ChatService) {
        this.chatService = chatServiceInstance;
    }

    public getConversations = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            if (!userId) {
                res.status(400).json({ message: 'userId es requerido en los parámetros de la ruta.' });
                return;
            }
            console.log(`MessageController: Solicitando lista de conversaciones para userId: ${userId}`);
            const conversations: ConversationListItemDto[] = await this.chatService.getConversationsForUser(userId);
            res.status(200).json(conversations);
        } catch (error: any) {
            console.error('Error en MessageController.getConversations:', error);
            res.status(500).json({ message: 'Error interno del servidor al obtener las conversaciones.', error: error.message });
        }
    }
    
    public getMessageHistory = async (req: Request, res: Response): Promise<void> => {
        try {
            const { user1Id, user2Id } = req.params;
            if (!user1Id || !user2Id) {
                res.status(400).json({ message: 'Se requieren user1Id y user2Id.' });
                return;
            }
            const messages: MessageDto[] = await this.chatService.getMessageHistory(user1Id, user2Id);
            res.status(200).json(messages);
        } catch (error: any) {
            console.error('Error en MessageController.getMessageHistory:', error);
            res.status(500).json({ message: 'Error al obtener historial.', error: error.message });
        }
    }

    public markAsRead = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const { messageId } = req.params;
            const userIdFromRequestBody = req.body.userIdMakingRequest;
            
            if (!userIdFromRequestBody) {
                res.status(400).json({ message: 'userIdMakingRequest es requerido en el cuerpo para pruebas.' });
                return;
            }
            if (!messageId) {
                res.status(400).json({ message: 'messageId es requerido.' });
                return;
            }
            const success = await this.chatService.markMessageAsRead(messageId, userIdFromRequestBody);
            if (success) {
                res.status(200).json({ message: 'Mensaje marcado como leído.' });
            } else {
                res.status(404).json({ message: 'No se pudo marcar como leído (no encontrado, sin permiso, o ya leído).' });
            }
        } catch (error: any) {
            console.error('Error en MessageController.markAsRead:', error);
            res.status(500).json({ message: 'Error al marcar como leído.', error: error.message });
        }
    }

    public getStompConfig = (req: Request, res: Response): void => {
        try {
            const stompUrl = this.chatService.getWebStompURL();
            const exchangeName = process.env.CHAT_EXCHANGE_NAME || 'chat_exchange';
            res.status(200).json({ stompUrl, exchange: exchangeName });
        } catch (error: any) {
            console.error('Error en MessageController.getStompConfig:', error);
            res.status(500).json({ message: 'Error al obtener config STOMP.', error: error.message });
        }
    }
}