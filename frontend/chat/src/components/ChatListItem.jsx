import React from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/ChatListItem.css";

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
    const navigate = useNavigate();

    const handlePress = () => {
        if (!currentUserId || !otherUserId || !currentUserType) {
            console.warn("ChatListItem: Faltan datos para navegar.", { currentUserId, otherUserId, currentUserType });
            return;
        }
        
        navigate(
            `/chat/${otherUserId}`, 
            { state: { 
                currentUserId, 
                currentUserType, 
                otherUserName, 
                chatTitle: chatContextTitle 
            }}
        );
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="chat-list-item" onClick={handlePress} role="button" tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && handlePress()}>
            <div className="avatar-container">
                <img src={avatarUri || "/default-avatar.png"} alt={otherUserName} className="avatar" />
            </div>
            <div className="content-container">
                <div className="header-container">
                    <h3 className="title-text">{otherUserName}</h3>
                    <span className="time-text">{formatTime(lastMessageTimestamp)}</span>
                </div>
                <p className="subtitle-text">{chatContextTitle}</p>
                <p className="message-text">{lastMessageContent || "No hay mensajes..."}</p>
            </div>
            {unreadCount > 0 && (
                <div className="unread-badge">
                    <span className="unread-text">{unreadCount > 9 ? '9+' : unreadCount}</span>
                </div>
            )}
        </div>
    );
};

export default ChatListItem;