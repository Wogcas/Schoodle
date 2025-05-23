import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../styles/ChatConversation.css";
import ChatScreenUI from "../components/ChatScreenUI";
import * as apiService from "../services/apiServiceMensajes";
import * as stompService from "../services/stompService";

function ChatConversation() {
    const { otherUserId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const passedState = location.state || {};
    const currentUserId = passedState.currentUserId || "parent-123";
    const currentUserType = passedState.currentUserType || "parent";
    const otherUserName = passedState.otherUserName || (otherUserId ? `Usuario ${otherUserId.substring(0,4)}` : "Desconocido");
    const chatTitle = passedState.chatTitle || "Chat";

    const [messages, setMessages] = useState([]);
    const [stompConfig, setStompConfig] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const isMountedRef = useRef(true);
    const stompSubscriptionRef = useRef(null);

    const participantInfoForUI = { id: otherUserId, name: otherUserName, title: chatTitle };

    const formatMessageForUI = useCallback((msgPayload, currentUserIdForCheck) => {
        const timestamp = msgPayload.timestamp || msgPayload.createdAt;
        const messageDate = timestamp ? new Date(timestamp) : new Date();
        return {
            id: msgPayload.id,
            text: msgPayload.content,
            time: messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: msgPayload.senderId === currentUserIdForCheck,
            status: msgPayload.senderId === currentUserIdForCheck
                ? (msgPayload.read ? 'seen' : (msgPayload.id?.startsWith('temp-') ? 'pending' : 'sent'))
                : (msgPayload.read ? 'seen' : 'delivered'),
            senderId: msgPayload.senderId,
            conversationId: msgPayload.conversationId,
            originalTimestamp: timestamp,
        };
    }, []);

    const handleIncomingStompMessage = useCallback((receivedStompMessage) => {
        if (!isMountedRef.current) return;
        const isRelevant =
            (receivedStompMessage.from === otherUserId && receivedStompMessage.to === currentUserId) ||
            (receivedStompMessage.from === currentUserId && receivedStompMessage.to === otherUserId);

        if (isRelevant) {
            const newChatMessage = formatMessageForUI(receivedStompMessage, currentUserId);
            setMessages(prevMessages => {
                let messageExists = false;
                let messageReplaced = false;
                let tempUpdatedMessages = prevMessages.map(msg => {
                    if (msg.id.startsWith('temp-') && msg.isOwn &&
                        msg.text === newChatMessage.text &&
                        new Date(msg.originalTimestamp).getTime() === new Date(newChatMessage.originalTimestamp).getTime() &&
                        newChatMessage.senderId === currentUserId) {
                        messageExists = true;
                        messageReplaced = true;
                        return newChatMessage;
                    }
                    if (msg.id === newChatMessage.id && !newChatMessage.id.startsWith('temp-')) {
                        messageExists = true;
                        return msg;
                    }
                    return msg;
                });

                if (!messageExists) {
                    tempUpdatedMessages.push(newChatMessage);
                }

                return tempUpdatedMessages.sort((a, b) => new Date(a.originalTimestamp || 0).getTime() - new Date(b.originalTimestamp || 0).getTime());
            });
            if (newChatMessage.senderId === otherUserId && document.visibilityState === 'visible') {
                apiService.markMessageAsRead(newChatMessage.id, currentUserId)
                    .catch(err => {});
            }
        }
    }, [currentUserId, otherUserId, formatMessageForUI]);

    useEffect(() => {
        isMountedRef.current = true;
        let localStompConfig = null;

        const initializeChat = async () => {
            if (!currentUserId || !otherUserId || !currentUserType) {
                if (isMountedRef.current) setError("Faltan parámetros de usuario.");
                if (isMountedRef.current) setIsLoading(false);
                return;
            }
            if (isMountedRef.current) { setIsLoading(true); setError(null); }

            try {
                localStompConfig = await apiService.getStompConfig();
                if (!isMountedRef.current) return;
                setStompConfig(localStompConfig);

                const onStompClientConnected = async (client) => {
                    if (!isMountedRef.current || !client || !client.active) {
                        if(isMountedRef.current && !error) setError("No se pudo conectar al chat en tiempo real (cliente STOMP no activo).");
                        if(isMountedRef.current) setIsLoading(false);
                        return;
                    }
                    try {
                        const history = await apiService.getMessageHistory(currentUserId, otherUserId);
                        if (!isMountedRef.current) return;
                        const formattedHistory = history.map(msg => formatMessageForUI(msg, currentUserId));
                        setMessages(formattedHistory.sort((a, b) => new Date(a.originalTimestamp || 0).getTime() - new Date(b.originalTimestamp || 0).getTime()));

                        const topic = `/exchange/${localStompConfig.exchange}/chat.*.${currentUserId}`;

                        if (stompSubscriptionRef.current && typeof stompSubscriptionRef.current.unsubscribe === 'function') {
                            stompSubscriptionRef.current.unsubscribe();
                        }
                        stompSubscriptionRef.current = stompService.subscribeToMessages(client, topic, handleIncomingStompMessage);
                        if(!stompSubscriptionRef.current && isMountedRef.current){
                            setError("No se pudo suscribir a los mensajes en tiempo real.");
                        }

                    } catch (historyError) {
                        if (!isMountedRef.current) return;
                    } finally {
                        if (isMountedRef.current) setIsLoading(false);
                    }
                };
                stompService.connectStomp(localStompConfig, onStompClientConnected);
            } catch (err) {
                if (!isMountedRef.current) return;
                if (isMountedRef.current) setError("Error al conectar con el servidor de chat.");
                if (isMountedRef.current) setIsLoading(false);
            }
        };
        initializeChat();
        const handleVisibilityChange = () => {};
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            isMountedRef.current = false;
            if (stompSubscriptionRef.current && typeof stompSubscriptionRef.current.unsubscribe === 'function') {
                stompSubscriptionRef.current.unsubscribe();
                stompSubscriptionRef.current = null;
            }
            stompService.disconnectStomp();
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [currentUserId, otherUserId, currentUserType, formatMessageForUI, handleIncomingStompMessage]);

    const handleSendMessage = useCallback(async (textContent) => {
       if (!textContent.trim() || !stompConfig || !currentUserId || !otherUserId || !currentUserType) {
            setError("No se puede enviar el mensaje ahora. Verifica tu conexión o configuración.");
            return;
        }
        const clientTimestamp = new Date().toISOString();
        const tempId = `temp-${new Date(clientTimestamp).getTime()}`;

        const messagePayload = {
            from: currentUserId,
            to: otherUserId,
            content: textContent.trim(),
            timestamp: clientTimestamp,
            senderUserType: currentUserType,
        };
        const destination = `/exchange/${stompConfig.exchange}/chat.message.save`;

        const optimisticMsg = formatMessageForUI({
            id: tempId,
            content: textContent.trim(),
            timestamp: clientTimestamp,
            senderId: currentUserId,
            read: false,
            conversationId: messages[0]?.conversationId || `conv-temp-${currentUserId}-${otherUserId}`
        }, currentUserId);
        setMessages(prev => [...prev, { ...optimisticMsg, status: 'pending' }].sort((a, b) => new Date(a.originalTimestamp || 0).getTime() - new Date(b.originalTimestamp || 0).getTime()));

        const sent = stompService.sendMessageViaStomp(destination, messagePayload);
        if (sent) { setError(null); } else {
            setError("No se pudo enviar el mensaje. Intenta de nuevo.");
            setMessages(prev => prev.filter(msg => msg.id !== optimisticMsg.id));
        }
    }, [stompConfig, currentUserId, otherUserId, currentUserType, formatMessageForUI, messages]);

    if (!currentUserId || !otherUserId) { }
    if (isLoading && messages.length === 0) { }
    return (
        <div className="chat-conversation-container">
            <ChatScreenUI
                teacher={participantInfoForUI}
                messages={messages}
                onSendMessage={handleSendMessage}
                showBackButton={true}
            />
            {error && <div className="error-banner"><p>{error}</p></div>}
        </div>
    );
}
export default ChatConversation;
