"use client";

import React, { useState, useEffect, useCallback } from 'react'; 
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import ChatScreenComponent from "../../components/ChatScreen"; 

// Importar los servicios
import * as apiService from "../../services/apiServiceMensajes";
import * as stompService from "../../services/stompService";

const MOCK_CURRENT_USER_ID = "parent-123";

export default function ChatDetailContainerScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    
    // 'id' de la ruta es el ID del OTRO usuario (el profesor)
    const otherUserId = params.id; 

    const otherUserName = params.otherUserName || "Profesor/a";
    const chatTitle = params.chatTitle || "Chat";

    const currentUserId = MOCK_CURRENT_USER_ID;

    const [messages, setMessages] = useState([]);
    const [stompConfig, setStompConfig] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Información del profesor (otro usuario) para pasar al componente de UI
    const teacherInfo = {
        id: otherUserId,
        name: otherUserName,
        title: chatTitle,
    };

    // Cargar configuración STOMP y conectar
    useEffect(() => {
        let isActive = true;
        let subscription = null;

        const initializeChat = async () => {
            if (!currentUserId || !otherUserId) {
                setError("Faltan IDs de usuario para iniciar el chat.");
                setIsLoading(false);
                return;
            }
            try {
                setError(null);
                setIsLoading(true);
                console.log(`[id].js: Obteniendo config STOMP para ${currentUserId} y ${otherUserId}`);
                const config = await apiService.getStompConfig();
                if (!isActive) return;
                setStompConfig(config);

                stompService.connectStomp(config, () => {
                    if (!isActive) return;
                    console.log("[id].js: Conexión STOMP OK. Cargando historial y suscribiendo.");
                    loadHistoryAndSubscribe(config);
                });

            } catch (err) {
                if (!isActive) return;
                console.error("[id].js: Error inicializando chat:", err);
                setError("Error al conectar. Intenta de nuevo.");
                setIsLoading(false);
            }
        };

        const loadHistoryAndSubscribe = async (currentStompConfig) => {
            if (!currentUserId || !otherUserId || !currentStompConfig) {
                setIsLoading(false);
                return;
            }
            try {
                const history = await apiService.getMessageHistory(currentUserId, otherUserId);
                if (!isActive) return;
                const formattedHistory = history.map(msg => ({
                    id: msg.id,
                    text: msg.content,
                    time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isOwn: msg.senderId === currentUserId,
                    status: msg.read ? 'seen' : (msg.senderId === currentUserId ? 'sent' : 'delivered'),
                    senderId: msg.senderId,
                    conversationId: msg.conversationId,
                })).reverse();
                setMessages(formattedHistory);

                const topic = `/exchange/${currentStompConfig.exchange}/chat.message.notification.${currentUserId}`;
                console.log(`[id].js: Suscribiéndose a ${topic}`);
                subscription = stompService.subscribeToMessages(topic, (receivedStompMessage) => {
                    if (!isActive) return;
                    console.log("[id].js: Mensaje STOMP recibido:", receivedStompMessage);
                    
                    // Solo procesar si el mensaje es de esta conversación
                    if (receivedStompMessage.conversationId === formattedHistory[0]?.conversationId ||
                        (receivedStompMessage.senderId === otherUserId && receivedStompMessage.receiverId === currentUserId) ||
                        (receivedStompMessage.senderId === currentUserId && receivedStompMessage.receiverId === otherUserId)) {

                        const isOwnMessage = receivedStompMessage.senderId === currentUserId;
                        const newChatMessage = {
                            id: receivedStompMessage.id,
                            text: receivedStompMessage.content,
                            time: new Date(receivedStompMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            isOwn: isOwnMessage,
                            status: isOwnMessage ? 'sent' : 'delivered',
                            senderId: receivedStompMessage.senderId,
                            conversationId: receivedStompMessage.conversationId,
                        };
                        setMessages(prevMessages => [newChatMessage, ...prevMessages]);

                        if (!isOwnMessage && receivedStompMessage.id) {
                            apiService.markMessageAsRead(receivedStompMessage.id, currentUserId)
                                .catch(err => console.error("[id].js: Error marcando mensaje como leído:", err));
                        }
                    }
                });
            } catch (err) {
                if (!isActive) return;
                console.error("[id].js: Error cargando historial o suscribiéndose:", err);
                setError("No se pudo cargar el historial.");
            } finally {
                if (isActive) setIsLoading(false);
            }
        };
        
        initializeChat();

        return () => {
            isActive = false;
            if (subscription && typeof subscription.unsubscribe === 'function') {
                console.log("[id].js: Desuscribiéndose de STOMP.");
                subscription.unsubscribe();
            }
            console.log("[id].js: Desmontando. Desconectando STOMP.");
            stompService.disconnectStomp();
        };
    }, [currentUserId, otherUserId]); 

    const handleSendMessage = useCallback(async (textContent) => {
        if (!textContent.trim() || !stompConfig || !currentUserId || !otherUserId) return;

        const messagePayload = {
            from: currentUserId,
            to: otherUserId,
            content: textContent.trim(),
            timestamp: new Date().toISOString(),
        };
        const destination = `/exchange/${stompConfig.exchange}/chat.message.save`;
        
        try {
            stompService.sendMessageViaStomp(destination, messagePayload);
            // UI Optimista (opcional, ya que el mensaje debería volver por la suscripción)
            // const optimisticMessage = {
            //     id: `temp-${Date.now()}`,
            //     text: textContent.trim(),
            //     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            //     isOwn: true,
            //     status: 'pending',
            //     senderId: currentUserId,
            // };
            // setMessages(prevMessages => [optimisticMessage, ...prevMessages]);
        } catch (err) {
            console.error("[id].js: Error enviando mensaje vía STOMP:", err);
            setError("Error al enviar mensaje.");
        }
    }, [stompConfig, currentUserId, otherUserId]);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text>Cargando chat...</Text>
            </View>
        );
    }

    if (error && messages.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ChatScreenComponent
                teacher={teacherInfo}
                messages={messages}
                onSendMessage={handleSendMessage}
                showBackButton={true} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: Colors.notificationRed,
        fontSize: 16,
    }
});