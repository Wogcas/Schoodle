import { rabbitMQService } from '../rabbit/rabbit';
import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  read: boolean;
}

// Provisional
const messagesDB: ChatMessage[] = [];

export class ChatService {

  // Inicializar el servicio
  async initialize(): Promise<void> {
    await rabbitMQService.initialize();
    console.log('Servicio de chat inicializado');
  }

  // Enviar un mensaje
  async sendMessage(from: string, to: string, content: string): Promise<ChatMessage> {

    const message: ChatMessage = {
      id: uuidv4(),
      from,
      to,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };

    messagesDB.push(message);

    // Determinar el tipo de remitente (parent o teacher)
    const senderType = from.startsWith('parent') ? 'parent' : 'teacher';
    const receiverType = to.startsWith('parent') ? 'parent' : 'teacher';

    // Routing key formato: chat.{tipo-emisor}.{id-receptor}
    const routingKey = `chat.${senderType}.${to}`;

    await rabbitMQService.publishMessage(routingKey, message);

    console.log(`Mensaje enviado: ${from} -> ${to}`);
    return message;
  }

  // Obtener historial de mensajes entre dos usuarios
  getMessageHistory(user1: string, user2: string): ChatMessage[] {
    return messagesDB
      .filter(msg =>
        (msg.from === user1 && msg.to === user2) ||
        (msg.from === user2 && msg.to === user1)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Marcar mensaje como leído
  markMessageAsRead(messageId: string): boolean {
    const messageIndex = messagesDB.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) {
      return false;
    }

    messagesDB[messageIndex].read = true;
    return true;
  }

  // Crear cola para un usuario
  async setupUserQueue(userId: string): Promise<string> {
    return await rabbitMQService.createUserQueue(userId);
  }

  // Obtener URL para WebSTOMP
  getWebStompURL(): string {
    return rabbitMQService.getWebStompURL();
  }

  // Cerrar el servicio
  async close(): Promise<void> {
    await rabbitMQService.close();
  }
}

export const chatService = new ChatService();
export default chatService;