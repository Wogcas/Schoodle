export interface MessageDto {
  id: string;                 
  conversationId: string;     
  senderId: string;           
  receiverId: string;         
  content: string;
  timestamp: string;        
  read: boolean;
}