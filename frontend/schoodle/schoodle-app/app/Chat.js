"use client"

import { useState } from "react"
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import { Colors } from "../constants/Colors"
import ChatListItem from "../components/ChatListItem"
import SearchBar from "../components/SearchBar"

/**
 * @component ChatScreen
 * @description Pantalla principal de chat que muestra la lista de conversaciones
 * @returns {JSX.Element} Componente de pantalla de chat
 */
export default function ChatScreen() {
    const router = useRouter()

    // Datos de ejemplo para las conversaciones
    const conversations = [
        {
            id: "1",
            title: "Math",
            subtitle: "Carla Lopez",
            lastMessage: "Hello, teacher. I wanted to ask...",
            time: "9:30",
            status: "seen",
            avatar: require("../assets/images/women-teacher-avatar.png"),
        },
        {
            id: "2",
            title: "Homeroom teacher",
            subtitle: "Silvia Sánchez",
            lastMessage: "I wanted to update you on your...",
            time: "9:30",
            status: "pending",
            avatar: require("../assets/images/women-teacher-avatar.png"),
        },
        {
            id: "3",
            title: "English teacher",
            subtitle: "Simon Tyson",
            lastMessage: "I hope you're doing well. I...",
            time: "9:30",
            status: "sent",
            avatar: require("../assets/images/men-teacher-avatar.png"),
        },
    ]

    const [filteredArray, setFilteredArray] = useState(conversations);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Chat</Text>
                <TouchableOpacity style={styles.newChatButton}>
                    <Text style={styles.newChatText}>New chat +</Text>
                </TouchableOpacity>
            </View>

            <SearchBar
                arrayToFilter={conversations}
                onFilterChange={setFilteredArray}
            />

            <ScrollView style={styles.conversationsList}>
                {filteredArray.map((conversation) => (
                    <ChatListItem
                        key={conversation.id}
                        id={conversation.id}
                        title={conversation.title}
                        subtitle={conversation.subtitle}
                        lastMessage={conversation.lastMessage}
                        time={conversation.time}
                        status={conversation.status}
                        avatar={conversation.avatar}
                    />
                ))}
            </ScrollView>
        </View>
    )
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
        padding: 15,
    },
    backButton: {
        padding: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: Colors.text,
    },
    newChatButton: {
        padding: 5,
    },
    newChatText: {
        color: Colors.primary,
        fontSize: 16,
    },
    searchBar: {
        marginHorizontal: 15,
        marginBottom: 15,
    },
    conversationsList: {
        flex: 1,
    },
})
