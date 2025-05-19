"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { Colors } from "../../constants/Colors"
import ChatScreen from "../../components/ChatScreen"

/**
 * @component ChatDetailScreen
 * @description Pantalla de chat individual que muestra la conversación con un profesor
 * @returns {JSX.Element} Componente de pantalla de chat individual
 */
export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams()
  const [messages, setMessages] = useState([])
  const [teacher, setTeacher] = useState(null)

  // Datos de ejemplo para los profesores
  const teachers = {
    1: {
      id: "1",
      title: "Math teacher",
      name: "Carla Lopez",
    },
    2: {
      id: "2",
      title: "Homeroom teacher",
      name: "Silvia Sánchez",
    },
    3: {
      id: "3",
      title: "English teacher",
      name: "Simon Tyson",
    },
  }

  // Datos de ejemplo para los mensajes
  const initialMessages = {
    1: [
      {
        text: "My name is Carla Lopez, and I will be your child's Math teacher this school year.",
        time: "8:00",
        isOwn: false,
        status: "seen",
      },
      {
        text: "Hello, teacher. I wanted to ask how my child is doing in class and if there's anything we can do to support them at home.",
        time: "9:30",
        isOwn: true,
        status: "seen",
      },
    ],
    2: [
      {
        text: "Good morning! I wanted to remind you about the parent-teacher meeting next week.",
        time: "8:15",
        isOwn: false,
        status: "seen",
      },
      {
        text: "Thank you for the reminder. We'll be there.",
        time: "9:00",
        isOwn: true,
        status: "pending",
      },
    ],
    3: [
      {
        text: "Hello! Your child has been doing great in English class.",
        time: "8:30",
        isOwn: false,
        status: "seen",
      },
      {
        text: "That's wonderful to hear! Thank you for letting me know.",
        time: "9:30",
        isOwn: true,
        status: "sent",
      },
    ],
  }

  useEffect(() => {
    // Cargar el profesor y los mensajes según el ID
    if (id && teachers[id]) {
      setTeacher(teachers[id])
      setMessages(initialMessages[id] || [])
    }
  }, [id])

  const handleSendMessage = (text) => {
    const newMessage = {
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
      status: "sent",
    }

    setMessages((prevMessages) => [newMessage, ...prevMessages])

    // Simular cambio de estado después de un tiempo
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg, index) => (index === 0 ? { ...msg, status: "delivered" } : msg)),
      )
    }, 1000)

    // Simular que el mensaje ha sido visto después de un tiempo
    setTimeout(() => {
      setMessages((prevMessages) => prevMessages.map((msg, index) => (index === 0 ? { ...msg, status: "seen" } : msg)))
    }, 3000)
  }

  if (!teacher) {
    return <View style={styles.container} />
  }

  return (
    <View style={styles.container}>
      <ChatScreen teacher={teacher} messages={messages} onSendMessage={handleSendMessage} showBackButton={false} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
})
