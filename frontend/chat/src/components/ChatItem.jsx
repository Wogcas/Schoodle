"use client"

import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"

function ChatItem({ chat }) {
  const navigate = useNavigate()

  return (
    <div className="chat-item" onClick={() => navigate(`/chat/${chat.id}`)}>
      <div className="chat-avatar">
        <img src={chat.avatar || "/placeholder.svg"} alt={chat.teacher} />
      </div>
      <div className="chat-info">
        <h2>{chat.subject}</h2>
        <h3>{chat.teacher}</h3>
        <p>{chat.preview}</p>
      </div>
      <div className="chat-meta">
        <span className="chat-time">{chat.time}</span>
        <span className={`chat-status ${chat.status}`}>{chat.status}</span>
      </div>
    </div>
  )
}

ChatItem.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    subject: PropTypes.string.isRequired,
    teacher: PropTypes.string.isRequired,
    preview: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }).isRequired,
}

export default ChatItem
