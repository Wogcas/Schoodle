import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ChatList.css"; 
import ChatListItem from "../components/ChatListItem"; 
import SearchBar from "../components/SearchBar"; 
import * as apiService from "../services/apiServiceMensajes"; 
import menAvatar from "../assets/men-teacher-avatar.png";

const MOCK_CURRENT_USER_ID = "parent-123";
const MOCK_CURRENT_USER_TYPE = "parent";

function ChatList() {
    const navigate = useNavigate();
    const [rawConversations, setRawConversations] = useState([]);
    const [filteredConversations, setFilteredConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchConversations = useCallback(async () => {
        setError(null);
        try {
            console.log(`ChatList: Fetching conversations for user: ${MOCK_CURRENT_USER_ID}`);
            const data = await apiService.getConversationsForUser(MOCK_CURRENT_USER_ID);
            console.log(`ChatList: Received ${data.length} conversations from API.`);
            setRawConversations(data || []);
            setFilteredConversations(data || []);
        } catch (err) {
            console.error("ChatList: Error fetching conversations:", err);
            setError("No se pudieron cargar los chats. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    }, []); 
    
    useEffect(() => {
        setIsLoading(true);
        fetchConversations();
    }, [fetchConversations]);

    const handleRefresh = () => {
        setIsLoading(true);
        fetchConversations();
    };

    const handleSearchChange = (searchText) => {
        if (!searchText) {
            setFilteredConversations(rawConversations);
            return;
        }
        const lowercasedFilter = searchText.toLowerCase();
        const filteredData = rawConversations.filter((conv) => {
            const nameMatch = conv.otherParticipant?.name?.toLowerCase().includes(lowercasedFilter);
            const roleMatch = conv.otherParticipant?.role?.toLowerCase().includes(lowercasedFilter);
            const messageMatch = conv.lastMessage?.content?.toLowerCase().includes(lowercasedFilter);
            return nameMatch || roleMatch || messageMatch;
        });
        setFilteredConversations(filteredData);
    };

    if (isLoading && rawConversations.length === 0) {
        return (
            <div className="chat-list-container centered"> {/* Mantén tus clases CSS */}
                <div className="loading-indicator">
                    <div className="spinner"></div>
                    <p>Cargando tus chats...</p>
                </div>
            </div>
        );
    }

    if (error && rawConversations.length === 0) {
        return (
            <div className="chat-list-container centered">
                <div className="error-container">
                    <p className="error-text">{error}</p>
                    <button onClick={handleRefresh} className="retry-button">Reintentar</button>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-list-container"> {/* Tu contenedor principal */}
            <div className="chat-list-header">
                <div className="header-left">
                    <span className="back-arrow" onClick={() => navigate("/home")}>&#8249;</span>
                    <h1 className="chat-list-title">Chat</h1>
                </div>
                <button className="new-chat-button" onClick={() => navigate("/selectTeacherToChat")}>
                    Nuevo <span>+</span>
                </button>
            </div>

            <div className="search-bar-wrapper">
                <SearchBar onSearchChange={handleSearchChange} placeholder="Buscar por profesor o mensaje..." />
            </div>

            {filteredConversations.length === 0 && !isLoading ? (
                <div className="empty-chats-container">
                    <p className="empty-text">No tienes conversaciones aún.</p>
                    <p className="empty-subtext">Presiona "Nuevo +" para iniciar un chat.</p>
                    <button onClick={handleRefresh} className="refresh-button">Actualizar</button>
                </div>
            ) : (
                <div className="conversations-list">
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
                            avatarUri={menAvatar} // Placeholder
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
export default ChatList;