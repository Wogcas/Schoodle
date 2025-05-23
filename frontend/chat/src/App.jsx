import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import ChatList from "./pages/chatList";
import ChatConversation from "./pages/ChatConversation";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <div className="phone-container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/chats" element={<ChatList />} />
            <Route path="/chat/:otherUserId" element={<ChatConversation />} />
            <Route
              path="/selectTeacherToChat"
              element={
                <div style={{ padding: 20, textAlign: "center" }}>
                  <h2>Seleccionar Profesor</h2>
                </div>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
