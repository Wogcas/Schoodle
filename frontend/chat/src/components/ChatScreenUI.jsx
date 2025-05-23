"use client"

import { useRef, useEffect } from "react"
import PropTypes from "prop-types"
import ChatMessage from "./ChatMessage"
import ChatInput from "./ChatInput"
import { useNavigate } from "react-router-dom"
import "../styles/ChatScreenUI.css"

const ChatScreenUI = ({ teacher, messages = [], onSendMessage, showBackButton = false }) => {
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="chat-screen-container">
      <div className="chat-header">
        {showBackButton && (
          <span className="back-arrow" onClick={() => navigate("/chats")}>
            &#8249;
          </span>
        )}
        <div className="header-info">
          <h2 className="header-title">{teacher?.name || "Chat"}</h2>
          <p className="header-subtitle">{teacher?.title}</p>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-messages">
            <p>No hay mensajes aún. ¡Envía el primero!</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                text={message.text}
                time={message.time}
                isOwn={message.isOwn}
                status={message.status}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput onSendMessage={onSendMessage} />
    </div>
  )
}

ChatScreenUI.propTypes = {
  teacher: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
  }),
  messages: PropTypes.array,
  onSendMessage: PropTypes.func.isRequired,
  showBackButton: PropTypes.bool,
}

export default ChatScreenUI
