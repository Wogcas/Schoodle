import PropTypes from "prop-types"
import "../styles/ChatMessage.css"

const ChatMessage = ({ text, time, isOwn, status }) => {
  return (
    <div className={`message-container ${isOwn ? "own-message" : "other-message"}`}>
      <div className="message-bubble">
        <p className="message-text">{text}</p>
        <div className="message-footer">
          <span className="time-text">{time}</span>
          {isOwn && (
            <span className="status-text">
              {status === "seen" ? "✓✓" : status === "delivered" ? "✓✓" : status === "sent" ? "✓" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

ChatMessage.propTypes = {
  text: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  isOwn: PropTypes.bool.isRequired,
  status: PropTypes.string,
}

export default ChatMessage
