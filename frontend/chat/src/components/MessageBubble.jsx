import PropTypes from "prop-types"

function MessageBubble({ message }) {
  return (
    <div className={`message ${message.sender}`}>
      <div className="message-bubble">
        <p>{message.text}</p>
        <span className="message-time">{message.time}</span>
      </div>
    </div>
  )
}

MessageBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    sender: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }).isRequired,
}

export default MessageBubble
