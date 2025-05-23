"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/Login.css"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate("/home")
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>
          Schoodle <span>login</span>
        </h1>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="accept-button">
          Accept
        </button>
      </form>
    </div>
  )
}

export default Login
