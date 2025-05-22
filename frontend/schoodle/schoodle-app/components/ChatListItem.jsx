import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../constants/Colors";

const ChatListItem = ({
    currentUserId,
    currentUserType,
    otherUserId, 
    otherUserName,
    chatContextTitle,
    lastMessageContent,
    lastMessageTimestamp,
    unreadCount,
    avatarUri,
}) => {
    const router = useRouter();

    const handlePress = () => {
        if (!currentUserId || !otherUserId || !currentUserType) {
            console.warn("ChatListItem: Faltan IDs o currentUserType para navegar.", {currentUserId, otherUserId, currentUserType});
            return;
        }
        router.push({
            pathname: `/chat/${otherUserId}`,
            params: {
                currentUserId: currentUserId,
                currentUserType: currentUserType,
                otherUserName: otherUserName,
                chatTitle: chatContextTitle,
            },
        });
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <View style={styles.avatarContainer}>
                <Image source={avatarUri} style={styles.avatar} />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.titleText} numberOfLines={1}>{otherUserName}</Text>
                    {lastMessageTimestamp && (
                        <Text style={styles.timeText}>
                            {new Date(lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    )}
                </View>
                <Text style={styles.subtitleText} numberOfLines={1}>{chatContextTitle}</Text>
                <View style={styles.messageRow}>
                    <Text style={styles.messageText} numberOfLines={1} ellipsizeMode="tail">
                        {lastMessageContent}
                    </Text>
                    {unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
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
        flexShrink: 1, 
    },
    subtitleText: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 3,
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    messageText: {
        fontSize: 14,
        color: Colors.textSecondary,
        flex: 1, 
    },
    timeText: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginLeft: 8, 
    },
    unreadBadge: {
        backgroundColor: Colors.primary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        paddingHorizontal: 6,
    },
    unreadText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default ChatListItem;