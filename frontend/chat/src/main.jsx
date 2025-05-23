import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ChatList from './pages/chatList';
import ChatConversation from './pages/ChatConversation'; 
import Home from './pages/home'; 
import './index.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chats" element={<ChatList />} />
        <Route path="/chat/:otherUserId" element={<ChatConversation />} />
        <Route path="*" element={<Navigate to="/chats" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);