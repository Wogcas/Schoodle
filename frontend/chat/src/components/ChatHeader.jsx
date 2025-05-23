"use client"

import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"

function ChatHeader({ title, subtitle, backTo }) {
  const navigate = useNavigate()

  return (
    <div className="chat-header">
      <button className="back-button" onClick={() => navigate(backTo)}>
        &#8249;
      </button>
      <div className="chat-header-info">
        <h1>{title}</h1>
        {subtitle && <h2>{subtitle}</h2>}
      </div>
    </div>
  )
}

ChatHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  backTo: PropTypes.string.isRequired,
}

export default ChatHeader
