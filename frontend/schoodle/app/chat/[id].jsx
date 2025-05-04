"use client"

import { useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { useLocalSearchParams } from "expo-router"
import Header from "../../components/Header"
import ChatMessage from "../../components/ChatMessage"
import MessageInput from "../../components/MessageInput"

// Datos de ejemplo para los diferentes chats
const chatData = {
  math: {
    name: "Carla Lopez",
    role: "Math teacher",
    messages: [
      {
        id: 1,
        text: "My name is Carla Lopez, and I will be your child's Math teacher this school year.",
        time: "8:00",
        isUser: false,
      },
      {
        id: 2,
        text: "Hello, teacher. I wanted to ask how my child is doing in class and if there's anything we can do to support them at home.",
        time: "9:30",
        isUser: true,
      },
    ],
  },
  homeroom: {
    name: "Silvia Sánchez",
    role: "Homeroom teacher",
    messages: [
      {
        id: 1,
        text: "I wanted to update you on your child's progress this week.",
        time: "9:00",
        isUser: false,
      },
    ],
  },
  english: {
    name: "Simon Tyson",
    role: "English teacher",
    messages: [
      {
        id: 1,
        text: "I hope you're doing well. I wanted to share some resources for English practice at home.",
        time: "8:45",
        isUser: false,
      },
    ],
  },
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams()
  const chatId = typeof id === "string" ? id : "math"
  const chat = chatData[chatId] || chatData.math

  const [messages, setMessages] = useState(chat.messages)

  const handleSendMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isUser: true,
    }
    setMessages([...messages, newMessage])
  }

  return (
    <View style={styles.container}>
      <Header title={chat.role} showBackButton={true} />
      <View style={styles.subheader}>
        <Header title={chat.name} showBackButton={false} />
      </View>

      <ScrollView style={styles.messagesContainer}>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message.text} time={message.time} isUser={message.isUser} />
        ))}
      </ScrollView>

      <MessageInput onSend={handleSendMessage} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subheader: {
    marginTop: -20,
  },
  messagesContainer: {
    flex: 1,
    paddingVertical: 10,
  },
})
