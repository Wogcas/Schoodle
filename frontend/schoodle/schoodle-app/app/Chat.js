"use client";

import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, ActivityIndicator, Platform, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../constants/Colors";
import ChatListItem from "../components/ChatListItem";
import SearchBar from "../components/SearchBar"; 
import * as apiService from '../services/apiServiceMensajes';

// --- SIMULACIÓN DE AUTENTICACIÓN ---
const MOCK_CURRENT_USER_ID = "parent-123";
const MOCK_CURRENT_USER_TYPE = "parent";


export default function ChatListScreen() {
    const router = useRouter();
    const [rawConversations, setRawConversations] = useState([]);
    const [filteredConversations, setFilteredConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchConversations = useCallback(async () => {
        setError(null);
        try {
            console.log(`ChatListScreen: Fetching conversations for user: ${MOCK_CURRENT_USER_ID}`);
            const data = await apiService.getConversationsForUser(MOCK_CURRENT_USER_ID);
            console.log(`ChatListScreen: Received ${data.length} conversations from API.`);
            setRawConversations(data || []);
            setFilteredConversations(data || []);
        } catch (err) {
            console.error("ChatListScreen: Error fetching conversations:", err);
            setError("No se pudieron cargar los chats. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetchConversations();
    }, [fetchConversations]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchConversations();
    }, [fetchConversations]);

    const handleSearchChange = (searchText) => {
        if (!searchText) {
            setFilteredConversations(rawConversations);
            return;
        }
        const lowercasedFilter = searchText.toLowerCase();
        const filteredData = rawConversations.filter(conv => {
            const nameMatch = conv.otherParticipant?.name?.toLowerCase().includes(lowercasedFilter);
            const roleMatch = conv.otherParticipant?.role?.toLowerCase().includes(lowercasedFilter);
            const messageMatch = conv.lastMessage?.content?.toLowerCase().includes(lowercasedFilter);
            return nameMatch || roleMatch || messageMatch;
        });
        setFilteredConversations(filteredData);
    };
    
    if (isLoading && rawConversations.length === 0) { 
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={{marginTop: 10, color: Colors.textSecondary}}>Cargando tus chats...</Text>
            </View>
        );
    }

    if (error && rawConversations.length === 0) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={fetchConversations} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Chat</Text>
                <TouchableOpacity style={styles.newChatButton} onPress={() => router.push('/selectTeacherToChat')}>
                    {/* TODO: Implementar pantalla para seleccionar profesor e iniciar un nuevo chat */}
                    <Text style={styles.newChatText}>Nuevo +</Text>
                </TouchableOpacity>
            </View>

            <SearchBar
                onSearchChange={handleSearchChange}
                placeholder="Buscar por profesor o mensaje..."
            />

            {filteredConversations.length === 0 && !isLoading ? (
                <ScrollView
                    contentContainerStyle={[styles.container, styles.centered, {paddingBottom: 100}]}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]}/>}
                >
                    <Text style={styles.emptyText}>No tienes conversaciones aún.</Text>
                    <Text style={styles.emptySubText}>Presiona "Nuevo +" para iniciar un chat.</Text>
                </ScrollView>
            ) : (
                <ScrollView 
                    style={styles.conversationsList}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]}/>}
                >
                    {filteredConversations.map((conv) => (
                        <ChatListItem
                            key={conv.conversationId}
                            currentUserId={MOCK_CURRENT_USER_ID} 
                            currentUserType={MOCK_CURRENT_USER_TYPE}
                            otherUserId={conv.otherParticipant.id}
                            otherUserName={conv.otherParticipant.name}
                            chatContextTitle={conv.otherParticipant.role || "Chat"}
                            lastMessageContent={conv.lastMessage?.content || "..."}
                            lastMessageTimestamp={conv.lastMessage?.timestamp}
                            unreadCount={conv.unreadCount || 0}
                            avatarUri={require("../assets/images/men-teacher-avatar.png")} 
                        />
                    ))}
                </ScrollView>
            )}
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
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 10,
        backgroundColor: Colors.white,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.lightGray,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.text,
    },
    newChatButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    newChatText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '500',
    },
    conversationsList: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    errorText: {
        color: Colors.notificationRed,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15,
    },
    retryButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyText: {
        fontSize: 18,
        color: Colors.secondary,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubText: {
        fontSize: 14,
        color: Colors.textTertiary,
        textAlign: 'center',
    }
});