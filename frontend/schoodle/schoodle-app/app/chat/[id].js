"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, AppState, Keyboard, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import ChatScreenUI from "../../components/ChatScreen";

import * as apiService from "../../services/apiServiceMensajes";
import * as stompService from "../../services/stompService"; 

export default function ChatDetailLogicScreen() { 
    const router = useRouter();
    const params = useLocalSearchParams();
    
    const otherUserId = params.id; 
    const currentUserId = params.currentUserId;
    const currentUserType = params.currentUserType;
    const otherUserName = params.otherUserName || "Profesor/a";
    const chatTitle = params.chatTitle || "Chat";

    const [messages, setMessages] = useState([]);
    const [stompConfig, setStompConfig] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const appState = useRef(AppState.currentState);
    const stompClientRef = useRef(null);
    const stompSubscriptionRef = useRef(null);
    const isMountedRef = useRef(true);
    
    const participantInfoForUI = {
        id: otherUserId,
        name: otherUserName,
        title: chatTitle,
    };

    const formatMessageForUI = useCallback((msgPayload, currentUserIdForCheck) => {
        const timestamp = msgPayload.timestamp || msgPayload.createdAt;
        return {
            id: msgPayload.id,
            text: msgPayload.content,
            time: timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '??:??',
            isOwn: msgPayload.senderId === currentUserIdForCheck,
            status: msgPayload.senderId === currentUserIdForCheck 
                    ? (msgPayload.read ? 'seen' : 'sent')
                    : (msgPayload.read ? 'seen' : 'delivered'),
            senderId: msgPayload.senderId,
            conversationId: msgPayload.conversationId,
        };
    }, []);

    const connectAndSubscribe = useCallback(async (config) => {
        if (!isMountedRef.current || !config || !currentUserId || !otherUserId) return;

        return new Promise((resolve, reject) => {
            stompService.connectStomp(config, async (client) => {
                if (!isMountedRef.current || !client || !client.active) {
                    if(isMountedRef.current) setError("No se pudo conectar al chat en tiempo real.");
                    reject(new Error("STOMP client not active in onConnect"));
                    return;
                }
                stompClientRef.current = client;
                console.log("ChatDetailScreen: Conexión STOMP OK. Cargando historial y suscribiendo...");
                
                try {
                    const history = await apiService.getMessageHistory(currentUserId, otherUserId);
                    if (!isMountedRef.current) { reject(new Error("Component unmounted during history fetch")); return; }
                    const formattedHistory = history.map(msg => formatMessageForUI(msg, currentUserId)).reverse();
                    setMessages(formattedHistory);

                    const topic = `/exchange/${config.exchange}/chat.*.${currentUserId}`;
                    console.log(`ChatDetailScreen: Suscribiéndose a ${topic}`);
                    
                    if (stompSubscriptionRef.current && typeof stompSubscriptionRef.current.unsubscribe === 'function') {
                        stompSubscriptionRef.current.unsubscribe(); 
                    }

                    stompSubscriptionRef.current = stompService.subscribeToMessages(topic, (receivedStompMessage) => {
                        if (!isMountedRef.current) return;
                        console.log("ChatDetailScreen: Mensaje STOMP recibido:", receivedStompMessage);
                        
                        const convIdFromCurrentMessages = messages[0]?.conversationId || formattedHistory[0]?.conversationId;

                        if (receivedStompMessage.conversationId === convIdFromCurrentMessages ||
                            (receivedStompMessage.from === otherUserId && receivedStompMessage.to === currentUserId) ||
                            (receivedStompMessage.from === currentUserId && receivedStompMessage.to === otherUserId)
                        ) {
                            const newChatMessage = formatMessageForUI(receivedStompMessage, currentUserId);
                            setMessages(prevMessages => [newChatMessage, ...prevMessages]);
                            if (newChatMessage.senderId === otherUserId && AppState.currentState === "active") {
                                apiService.markMessageAsRead(newChatMessage.id, currentUserId)
                                    .catch(err => console.error("ChatDetailScreen: Error marcando mensaje como leído:", err));
                            }
                        }
                    });
                    resolve(stompSubscriptionRef.current);
                    if (!isMountedRef.current) { reject(new Error("Component unmounted during history/subscribe")); return; }
                    console.error("ChatDetailScreen: Error cargando historial o suscribiéndose:", err);
                    setError("No se pudo cargar el historial.");
                    reject(err);
                } finally {
                    if (isMountedRef.current) setIsLoading(false);
                }
            });
        });
    }, [currentUserId, otherUserId, formatMessageForUI, messages]);

    useEffect(() => {
        isMountedRef.current = true;
        let currentSubscription = null;

        const initialize = async () => {
            if (!currentUserId || !otherUserId || !currentUserType) {
                if (isMountedRef.current) setError("Faltan parámetros de usuario para iniciar el chat.");
                if (isMountedRef.current) setIsLoading(false);
                return;
            }
            
            if (isMountedRef.current) setIsLoading(true);
            if (isMountedRef.current) setError(null);
            
            try {
                console.log("ChatDetailScreen: Obteniendo config STOMP...");
                const config = await apiService.getStompConfig();
                if (!isMountedRef.current) return;
                console.log("ChatDetailScreen: Configuración STOMP recibida del API:", JSON.stringify(config, null, 2));
                setStompConfig(config); 
                
                currentSubscription = await connectAndSubscribe(config);

            } catch (err) {
                if (!isMountedRef.current) return;
                console.error("ChatDetailScreen: Error inicializando chat (obtener config o conectar):", err);
                if (isMountedRef.current) setError("Error al conectar con el servidor de chat.");
                if (isMountedRef.current) setIsLoading(false);
            }
        };
        
        initialize();

        const handleAppStateChange = (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                console.log('App has come to the foreground!');
                if (stompClientRef.current && !stompClientRef.current.active && stompConfig) {
                    console.log("Re-activating STOMP connection on app foreground.");
                    connectAndSubscribe(stompConfig).then(sub => {
                        if (isMountedRef.current) currentSubscription = sub;
                    });
                } else if (!stompClientRef.current && stompConfig) {
                    console.log("STOMP client no existe pero hay config, re-inicializando.");
                    initialize();
                }
            }
            appState.current = nextAppState;
        };
        
        const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            isMountedRef.current = false;
            console.log("ChatDetailScreen: Cleanup de useEffect. Desuscribiendo y desconectando STOMP.");
            if (currentSubscription && typeof currentSubscription.unsubscribe === 'function') {
                currentSubscription.unsubscribe();
            } else if (stompSubscriptionRef.current && typeof stompSubscriptionRef.current.unsubscribe === 'function') {
                 stompSubscriptionRef.current.unsubscribe();
            }
            stompService.disconnectStomp();
            appStateSubscription.remove();
            stompClientRef.current = null;
            stompSubscriptionRef.current = null;
        };
   }, [currentUserId, otherUserId, currentUserType, connectAndSubscribe]);

    const handleSendMessage = useCallback(async (textContent) => {
        if (!textContent.trim() || !stompConfig || !currentUserId || !otherUserId || !currentUserType) {
            console.warn("ChatDetailScreen: No se puede enviar. Faltan datos.", 
                {hasConfig: !!stompConfig, currentUserId, otherUserId, currentUserType});
            setError("No se puede enviar el mensaje ahora. Verifica tu conexión.");
            return;
        }
        const messagePayload = {
            from: currentUserId,
            to: otherUserId,
            content: textContent.trim(),
            timestamp: new Date().toISOString(),
            senderUserType: currentUserType,
        };
        const destination = `/exchange/${stompConfig.exchange}/chat.message.save`;
        
        console.log(`ChatDetailScreen: Enviando mensaje a ${destination}`, messagePayload);
        const sent = stompService.sendMessageViaStomp(destination, messagePayload);
        if (!sent) {
            setError("No se pudo enviar el mensaje. Intenta de nuevo.");
        } else {
            Keyboard.dismiss();
            setError(null);
        }
    }, [stompConfig, currentUserId, otherUserId, currentUserType]);

    const handleRetryInitialize = () => {
        setIsLoading(true);
        setError(null);
        console.log("Intentando re-inicializar el chat...");

    };
    
    if (!currentUserId || !otherUserId) {
        return (
             <View style={styles.centered}>
                <Text style={styles.errorText}>Error: No se especificaron los participantes del chat.</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    if (isLoading && messages.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerInfo}><Text style={styles.headerTitle}>{participantInfoForUI.name}</Text></View><View style={{width:28}}/>
                </View>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={{marginTop:10, color: Colors.textSecondary}}>Cargando chat...</Text>
                </View>
            </View>
        );
    }

    if (error && messages.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : null} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color={Colors.text} />
                    </TouchableOpacity>
                    <View style={styles.headerInfo}><Text style={styles.headerTitle}>{participantInfoForUI.name}</Text></View><View style={{width:28}}/>
                </View>
                <View style={styles.centered}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Text style={{marginTop: 10, color: Colors.textSecondary}}>Intenta volver y reingresar al chat.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ChatScreenUI
                teacher={participantInfoForUI}
                messages={messages}
                onSendMessage={handleSendMessage}
                showBackButton={true}
            />
             {error && messages.length > 0 && <Text style={styles.inlineError}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: StyleSheet.hairlineWidth, 
        borderBottomColor: Colors.lightGray, 
        backgroundColor: Colors.white,
    },
    backButton: {
        padding: 5,
        marginRight: 5,
    },
    headerInfo: {
        flex: 1,
        alignItems: 'flex-start', 
    },
    headerTitle: {
        fontSize: 17, 
        fontWeight: "600", 
        color: Colors.text,
    },
    headerSubtitle: { 
        fontSize: 13,
        color: Colors.secondary,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: Colors.notificationRed,
        fontSize: 16,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 15,
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 5,
    },
    retryButtonText: {
        color: Colors.white,
        fontSize: 16,
    },
    inlineError: {
        textAlign: 'center',
        color: Colors.notificationRed,
        padding: 5,
        backgroundColor: '#ffe0e0'
    }
});
