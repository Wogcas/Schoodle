import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // Usar useRouter para navegación programática
import { Colors } from "../constants/Colors"; // Ajusta la ruta

const ChatListItem = ({
    currentUserId, 
    otherUserId,     
    otherUserName,    
    chatContextTitle, 
    lastMessageContent,
    lastMessageTimestamp,
    // status,
    avatarUri,
}) => {
    const router = useRouter();

    const handlePress = () => {
        if (!currentUserId || !otherUserId) {
            console.warn("ChatListItem: Faltan IDs para navegar.");
            return;
        }
        router.push({
            pathname: `/chat/${otherUserId}`, 
            params: {
                currentUserId: currentUserId,
                otherUserIdParam: otherUserId, 
                otherUserName: otherUserName,  
                chatTitle: chatContextTitle, 
            },
        });
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <View style={styles.avatarContainer}>
                <Image source={typeof avatarUri === "string" ? { uri: avatarUri } : avatarUri} style={styles.avatar} />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.titleText}>{otherUserName}</Text>
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>
                            {lastMessageTimestamp ? new Date(lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                        </Text>
                    </View>
                </View>
                <Text style={styles.subtitleText}>{chatContextTitle}</Text>
                <Text style={styles.messageText} numberOfLines={1} ellipsizeMode="tail">
                    {lastMessageContent}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
        backgroundColor: Colors.white,
    },
    avatarContainer: {
        marginRight: 12,
        justifyContent: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.lightGray,
    },
    contentContainer: {
        flex: 1,
        justifyContent: "center",
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 2,
    },
    titleText: {
        fontSize: 16, 
        fontWeight: "600", 
        color: Colors.text,
    },
    subtitleText: { 
        fontSize: 14,
        color: Colors.textSecondary, 
        marginBottom: 3,
    },
    messageText: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    timeContainer: {
        alignItems: "flex-end",
    },
    timeText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
});

export default ChatListItem;
