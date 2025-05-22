import { MessageDto } from '../types/messageDTO';
import { NotificationPublisherService } from '../rabbit/notificationsRabbit';
import { ChatConsumerService } from '../rabbit/chatRabbit';
import { contextDB } from '../config/mapeo';
import { Conversation } from '../entities/conversation';
import { Message } from '../entities/message';
import { Repository } from 'typeorm';

const NOTIFICATIONS_EXCHANGE_NAME = process.env.NOTIFICATIONS_EXCHANGE_NAME!;
const CHAT_EXCHANGE = process.env.CHAT_EXCHANGE_NAME!; 

export interface ConversationListItemDto {
    conversationId: string;
    otherParticipant: {
        id: string;
        name: string;
        avatar?: string;
        role?: string;
    };
    lastMessage: {
        id: string;
        content: string;
        timestamp: string;
        senderId: string;
        read: boolean;
    } | null;
    unreadCount: number;
}

interface FullChatMessagePayload {
    from: string;
    to: string;
    content: string;
    timestamp: string; // Timestamp original del cliente
    senderUserType: string; // Tipo de usuario del remitente
}

export default class ChatService {
    private notificationPublisherService: NotificationPublisherService;
    private chatConsumerService: ChatConsumerService;
    private conversationRepository: Repository<Conversation>;
    private messageRepository: Repository<Message>;

    constructor(notificationPublisherService: NotificationPublisherService) {
        this.notificationPublisherService = notificationPublisherService;
        this.conversationRepository = contextDB.getRepository(Conversation);
        this.messageRepository = contextDB.getRepository(Message);
        this.chatConsumerService = new ChatConsumerService(this);
    }

    async initialize(): Promise<void> {
        console.log('ChatService: Iniciando inicialización general...');
        try {
            await this.notificationPublisherService.connect();

            if (!contextDB.isInitialized) {
                await contextDB.initialize();
            } else {
                console.log('ChatService: TypeORM DataSource (contextDB) ya estaba inicializado.');
            }

            if (this.chatConsumerService && typeof this.chatConsumerService.connect === 'function') {
                await this.chatConsumerService.connect();
            } else {
                console.warn('ChatService: ChatConsumerService no está disponible o no tiene un método connect.');
            }
        } catch (error) {
            console.error('ChatService: Error CRÍTICO durante la inicialización:', error);
            throw error;
        }
    }

    private async findOrCreateConversation(participant1Id: string, participant2Id: string): Promise<Conversation> {
        const [pA, pB] = [participant1Id, participant2Id].sort();
        let conversation = await this.conversationRepository.findOne({
            where: [ { participantA: pA, participantB: pB } ]
        });
        if (!conversation) {
            console.log(`ChatService: No se encontró conversación entre ${pA} y ${pB}. Creando nueva.`);
            const newConversation = this.conversationRepository.create({ participantA: pA, participantB: pB });
            conversation = await this.conversationRepository.save(newConversation);
            console.log(`ChatService: Nueva conversación creada con ID: ${conversation.id}`);
        } else {
            console.log(`ChatService: Conversación encontrada con ID: ${conversation.id}`);
        }
        return conversation;
    }

    async sendMessage(payload: FullChatMessagePayload): Promise<MessageDto> {
        const { from: senderId, to: receiverId, content, timestamp: clientTimestamp, senderUserType } = payload;

        console.log(`ChatService (sendMessage): Solicitud de ${senderId} (${senderUserType}) para ${receiverId}. Contenido: "${content}"`);
        
        if (!contextDB.isInitialized) {
            const errorMsg = "ChatService (sendMessage): DataSource no inicializado.";
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        const conversation = await this.findOrCreateConversation(senderId, receiverId);
        const newMessageEntity = this.messageRepository.create({
            conversation: conversation,
            senderId: senderId,
            content: content,
            read: false,
        });

        try {
            const savedMessage = await this.messageRepository.save(newMessageEntity);

            const chatMessageRoutingKey = `chat.${senderUserType}.${receiverId}`;
            
            const chatMessageForClientDelivery = {
                id: savedMessage.id,
                from: savedMessage.senderId,
                to: receiverId,
                content: savedMessage.content,
                timestamp: savedMessage.createdAt.toISOString(),
                senderUserType: senderUserType,
                conversationId: conversation.id
            };

            try {
                const amqpChannel = this.chatConsumerService.getChannel();
                if (amqpChannel) {
                    amqpChannel.publish(
                        CHAT_EXCHANGE,
                        chatMessageRoutingKey,
                        Buffer.from(JSON.stringify(chatMessageForClientDelivery))
                    );
                    console.log(`ChatService: Mensaje de CHAT (${savedMessage.id}) reenviado a ${CHAT_EXCHANGE} con RK ${chatMessageRoutingKey}`);
                } else {
                    console.error("ChatService: Canal AMQP de ChatConsumerService no disponible para reenviar mensaje de CHAT.");
                }
            } catch (publishChatError) {
                console.error('ChatService: Error al reenviar el mensaje de CHAT:', publishChatError);
            }

            try {
                const notificationPayload = {
                    id: savedMessage.id,
                    senderId: savedMessage.senderId,
                    content: savedMessage.content,
                    read: savedMessage.read,
                    createdAt: savedMessage.createdAt.toISOString(),
                    updatedAt: savedMessage.updatedAt.toISOString(),
                    receiverId: receiverId,
                    conversationId: conversation.id
                };
                await this.notificationPublisherService.publishMessage(
                    NOTIFICATIONS_EXCHANGE_NAME,
                    `chat.message.notification.${receiverId}`,
                    notificationPayload
                );
                console.log('ChatService: Notificación de chat (separada) publicada.');
            } catch (publishError) {
                console.error('ChatService: Error al publicar la notificación de chat (separada):', publishError);
            }

            return {
                id: savedMessage.id,
                conversationId: conversation.id,
                senderId: savedMessage.senderId,
                receiverId: conversation.participantA === senderId ? conversation.participantB : conversation.participantA,
                content: savedMessage.content,
                timestamp: savedMessage.createdAt.toISOString(),
                read: savedMessage.read,
            };
        } catch (dbError) {
            console.error('ChatService (sendMessage): ERROR AL GUARDAR MENSAJE EN BD:', dbError);
            throw new Error(`Error al guardar mensaje en la base de datos: ${dbError}`);
        }
    }
    
   async getMessageHistory(user1Id: string, user2Id: string): Promise<MessageDto[]> {
        console.log(`ChatService (getMessageHistory): Solicitud de historial entre ${user1Id} y ${user2Id}.`);
        if (!contextDB.isInitialized) {
            const errorMsg = "ChatService (getMessageHistory): DataSource no inicializado.";
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
        const [pA, pB] = [user1Id, user2Id].sort();
        const conversation = await this.conversationRepository.findOne({
            where: { participantA: pA, participantB: pB }
        });
        if (!conversation) {
            console.log(`ChatService (getMessageHistory): No se encontró conversación entre ${pA} y ${pB}.`);
            return [];
        }
        const messagesEntities = await this.messageRepository.find({
            where: { conversation: { id: conversation.id } },
            order: { createdAt: 'ASC' },
        });
        return messagesEntities.map(msg => ({
            id: msg.id,
            conversationId: conversation.id,
            senderId: msg.senderId,
            receiverId: conversation.participantA === msg.senderId ? conversation.participantB : conversation.participantA,
            content: msg.content,
            timestamp: msg.createdAt.toISOString(),
            read: msg.read,
        }));
    }

    async markMessageAsRead(messageId: string, userIdMakingRequest: string): Promise<boolean> {
        console.log(`ChatService (markMessageAsRead): Usuario ${userIdMakingRequest} intentando marcar mensaje ${messageId} como leído.`);
        if (!contextDB.isInitialized) {
            const errorMsg = "ChatService (markMessageAsRead): DataSource no inicializado.";
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
        const message = await this.messageRepository.findOne({
            where: { id: messageId },
            relations: ['conversation'],
        });
        if (!message) {
            console.warn(`ChatService (markMessageAsRead): Mensaje ${messageId} no encontrado.`);
            return false;
        }
        const conversation = message.conversation;
        if (message.senderId !== userIdMakingRequest && (conversation.participantA === userIdMakingRequest || conversation.participantB === userIdMakingRequest)) {
            const updateResult = await this.messageRepository.update(messageId, { read: true });
            const success = (updateResult.affected ?? 0) > 0;
            if (success) {
                console.log(`ChatService (markMessageAsRead): Mensaje ${messageId} marcado como leído.`);
            } else {
                console.warn(`ChatService (markMessageAsRead): No se pudo actualizar el estado de lectura del mensaje ${messageId}.`);
            }
            return success;
        } else {
            console.warn(`ChatService (markMessageAsRead): Usuario ${userIdMakingRequest} no autorizado para marcar mensaje ${messageId} o es el remitente.`);
            return false;
        }
    }

    async getConversationsForUser(userId: string): Promise<ConversationListItemDto[]> {
        if (!contextDB.isInitialized) {
            throw new Error("ChatService (getConversationsForUser): DataSource no inicializado.");
        }
        console.log(`ChatService: Buscando conversaciones para el usuario ${userId}`);
        const conversations = await this.conversationRepository.find({
            where: [ { participantA: userId }, { participantB: userId } ],
            order: { updatedAt: 'DESC' },
        });
        if (!conversations || conversations.length === 0) return [];
        const conversationListItems: ConversationListItemDto[] = [];
        for (const conv of conversations) {
            const otherParticipantId = conv.participantA === userId ? conv.participantB : conv.participantA;
            const otherParticipantName = `Usuario ${otherParticipantId.substring(0, 8)}`;
            const otherParticipantRole = (otherParticipantId.startsWith("teacher")) ? "Profesor/a" : "Padre/Madre";
            const lastMessage = await this.messageRepository.findOne({
                where: { conversation: { id: conv.id } },
                order: { createdAt: 'DESC' },
            });
            const unreadCount = await this.messageRepository.count({
                where: {
                    conversation: { id: conv.id },
                    senderId: otherParticipantId,
                    read: false,
                }
            });
            conversationListItems.push({
                conversationId: conv.id,
                otherParticipant: { id: otherParticipantId, name: otherParticipantName, role: otherParticipantRole },
                lastMessage: lastMessage ? {
                    id: lastMessage.id,
                    content: lastMessage.content,
                    timestamp: lastMessage.createdAt.toISOString(),
                    senderId: lastMessage.senderId,
                    read: lastMessage.senderId === userId ? true : lastMessage.read,
                } : null,
                unreadCount: unreadCount,
            });
        }
        conversationListItems.sort((a, b) => {
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
        });
        return conversationListItems;
    }

    getWebStompURL(): string {
        if (!this.chatConsumerService) {
            throw new Error("ChatConsumerService no está disponible en ChatService (getWebStompURL).");
        }
        return this.chatConsumerService.getWebStompURL();
    }

    async close(): Promise<void> {
        console.log('ChatService: Iniciando cierre del servicio...');
        try {
            if (this.chatConsumerService && typeof this.chatConsumerService.close === 'function') {
                await this.chatConsumerService.close();
            }
        } catch (error) { console.error('ChatService: Error cerrando ChatConsumerService:', error); }
        try {
            await this.notificationPublisherService.close();
        } catch (error) { console.error('ChatService: Error cerrando NotificationPublisherService:', error); }
        if (contextDB.isInitialized) {
            try { await contextDB.destroy(); } catch (error) { console.error('ChatService: Error destruyendo TypeORM DataSource:', error); }
        }
        console.log('ChatService: Servicio cerrado completamente.');
    }
}