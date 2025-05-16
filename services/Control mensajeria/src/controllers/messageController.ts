import { Request, Response } from 'express';
import ChatService from '../services/chatService';
import { MessageDto } from '../types/messageDTO';


interface AuthenticatedRequest extends Request {
    user?: {
        id: string; 
        // la voy a actualizar cuando sepa que pasar del auth
    };
}

export class MessageController {
    private chatService: ChatService;

    // La instancia de ChatService se inyecta a través del constructor
    constructor(chatServiceInstance: ChatService) {
        this.chatService = chatServiceInstance;
        // Ya no se necesita .bind(this) aquí si los métodos son arrow functions
    }

    // Obtener historial de mensajes entre dos usuarios
    // Definido como una arrow function para mantener el contexto de 'this'
    public getMessageHistory = async (req: Request, res: Response): Promise<void> => {
        try {
            const { user1Id, user2Id } = req.params;

            if (!user1Id || !user2Id) {
                res.status(400).json({ message: 'Se requieren user1Id y user2Id en los parámetros de la ruta.' });
                return;
            }

            console.log(`MessageController: Solicitando historial entre ${user1Id} y ${user2Id}`);
            const messages: MessageDto[] = await this.chatService.getMessageHistory(user1Id, user2Id);
            
            if (messages.length === 0) {
                console.log(`MessageController: No se encontró historial o conversación entre ${user1Id} y ${user2Id}.`);
            }
            res.status(200).json(messages);

        } catch (error: any) {
            console.error('Error en MessageController.getMessageHistory:', error);
            res.status(500).json({ message: 'Error interno del servidor al obtener el historial de mensajes.', error: error.message });
        }
    }

    // Marcar un mensaje como leído
    // Definido como una arrow function
    public markAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { messageId } = req.params;
            const userIdMakingRequest = req.user?.id;

            if (!userIdMakingRequest) {
                res.status(401).json({ message: 'No autorizado: ID de usuario no encontrado en la solicitud.' });
                return;
            }

            if (!messageId) {
                res.status(400).json({ message: 'Se requiere messageId en los parámetros de la ruta.' });
                return;
            }

            console.log(`MessageController: Usuario ${userIdMakingRequest} intentando marcar mensaje ${messageId} como leído.`);
            const success = await this.chatService.markMessageAsRead(messageId, userIdMakingRequest);
            
            if (success) {
                res.status(200).json({ message: 'Mensaje marcado como leído exitosamente.' });
            } else {
                res.status(404).json({ message: 'No se pudo marcar el mensaje como leído (verifique el ID del mensaje y los permisos).' });
            }

        } catch (error: any) {
            console.error('Error en MessageController.markAsRead:', error);
            res.status(500).json({ message: 'Error interno del servidor al marcar el mensaje como leído.', error: error.message });
        }
    }

    // Obtener información de conexión WebSTOMP
    // Definido como una arrow function
    public getStompConfig = (req: Request, res: Response): void => {
        try {
            const stompUrl = this.chatService.getWebStompURL();
            const exchangeName = process.env.CHAT_EXCHANGE_NAME || 'chat_exchange';

            console.log(`MessageController: Proporcionando configuración STOMP: URL=${stompUrl}, Exchange=${exchangeName}`);
            res.status(200).json({
                stompUrl,
                exchange: exchangeName,
            });
        } catch (error: any) {
            console.error('Error en MessageController.getStompConfig:', error);
            res.status(500).json({ message: 'Error interno del servidor al obtener la configuración STOMP.', error: error.message });
        }
    }
}