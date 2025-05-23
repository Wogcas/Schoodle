"use client"

import { useNavigate } from "react-router-dom"
import "../styles/Home.css"

import chattingIcon from "../assets/chatting.png"
import progressIcon from "../assets/progress.png"
import homeworkIcon from "../assets/homework.png"
import accountIcon from "../assets/account.png"

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <div className="notification-icon">
        <span className="notification-dot"></span>🔔
      </div>
      <div className="home-header">
        <h1>
          Schoodle <span>for parents</span>
        </h1>
      </div>
      <div className="menu-options">
        <div className="menu-option chat" onClick={() => navigate("/chats")}>
          <div className="option-icon">
            <img src={chattingIcon} alt="Chat Icon" />
          </div>
          <div className="option-text">
            <h2>Chat</h2>
            <p>Talk to the teacher</p>
          </div>
          <div className="option-arrow">›</div>
        </div>

        <div className="menu-option progress">
          <div className="option-icon">
            <img src={progressIcon} alt="Progress Icon" />
          </div>
          <div className="option-text">
            <h2>Progress</h2>
            <p>Student progress</p>
          </div>
          <div className="option-arrow">›</div>
        </div>

        <div className="menu-option homework">
          <div className="option-icon">
            <img src={homeworkIcon} alt="Homework Icon" />
          </div>
          <div className="option-text">
            <h2>Homework</h2>
            <p>Assigned activities</p>
          </div>
          <div className="option-arrow">›</div>
        </div>

        <div className="menu-option account">
          <div className="option-icon">
            <img src={accountIcon} alt="Account Icon" />
          </div>
          <div className="option-text">
            <h2>Account</h2>
            <p>My account details</p>
          </div>
          <div className="option-arrow">›</div>
        </div>
      </div>
    </div>
  )
}

export default Home
