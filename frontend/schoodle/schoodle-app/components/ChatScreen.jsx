"use client";

import React, { useState, useRef } from "react"; 
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import ChatMessage from "./ChatMessage";

/**
 * @component ChatScreenUI 
 * @description Componente para la UI de la pantalla de chat individual
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.teacher - Información del profesor/otro usuario { id, name, title }
 * @param {Array} props.messages - Lista de mensajes a mostrar
 * @param {Function} props.onSendMessage - Función para enviar un mensaje (toma el texto como argumento)
 * @param {boolean} props.showBackButton - Si se debe mostrar el botón de atrás
 * @returns {JSX.Element} Componente de UI de pantalla de chat
 */
const ChatScreenUI = ({ teacher, messages = [], onSendMessage, showBackButton = false }) => {
    const [newMessage, setNewMessage] = useState("");
    const router = useRouter();
    const flatListRef = useRef(null);

    const handleSend = () => {
        if (newMessage.trim() && typeof onSendMessage === 'function') {
            onSendMessage(newMessage.trim());
            setNewMessage("");
        }
    };

    const renderMessageItem = ({ item }) => (
        <ChatMessage
            text={item.text}
            time={item.time}
            isOwn={item.isOwn}
            status={item.status}
        />
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
            <View style={styles.header}>
                {showBackButton && (
                    <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : null} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color={Colors.text} />
                    </TouchableOpacity>
                )}
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>{teacher?.name || "Chat"}</Text>
                    <Text style={styles.headerSubtitle}>{teacher?.title}</Text>
                </View>
                 <View style={{width: 28}} /> 
            </View>

            {messages.length === 0 ? (
                <View style={styles.messagesContainerEmpty}>
                    <Text style={styles.emptyText}>No hay mensajes aún. ¡Envía el primero!</Text>
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessageItem}
                    keyExtractor={(item) => item.id?.toString() || `temp-${Math.random()}`} 
                    contentContainerStyle={styles.messagesListContainer}
                    inverted 
                />
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Escribe un mensaje..."
                    placeholderTextColor={Colors.secondary}
                    multiline
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSend}
                    disabled={!newMessage.trim()}
                >
                    <Ionicons
                        name="send"
                        size={24}
                        color={!newMessage.trim() ? Colors.secondary : Colors.primary}
                    />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

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
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.1)",
        backgroundColor: Colors.white,
    },
    backButton: {
        padding: 5,
        marginRight: 5,
    },
    headerInfo: {
        flex: 1,
        alignItems: 'flex-start',
        marginLeft: Platform.OS === 'ios' ? 0 : 10, 
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.text,
    },
    headerSubtitle: {
        fontSize: 13,
        color: Colors.secondary,
    },
    messagesContainerEmpty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: Colors.secondary,
        fontSize: 16,
    },
    messagesListContainer: { 
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexGrow: 1,
        justifyContent: "flex-end",
    },
    inputContainer: {
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingVertical: 8,
        paddingBottom: Platform.OS === 'ios' ? 20 : 8,
        borderTopWidth: 1,
        borderTopColor: "rgba(0, 0, 0, 0.1)",
        backgroundColor: Colors.white,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: Colors.lightGray,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: Platform.OS === 'ios' ? 10 : 8,
        fontSize: 16,
        maxHeight: 100,
        marginRight: 10,
    },
    sendButton: {
        padding: 8,
    },
});

export default ChatScreenUI;