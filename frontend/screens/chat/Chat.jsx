"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRoute } from "@react-navigation/native"
import BackButton from "../components/BackButton"
import MessageBubble from "../components/MessageBubble"

export default function Chat() {
  const [message, setMessage] = useState("")
  const route = useRoute()
  const { teacher } = route.params

  const messages = [
    {
      id: "1",
      text: "My name is Carla Lopez, and I will be your child's Math teacher this school year.",
      time: "8:00",
      isUser: false,
    },
    {
      id: "2",
      text: "Hello, teacher. I wanted to ask how my child is doing in class and if there's anything we can do to support them at home.",
      time: "9:30",
      isUser: true,
    },
  ]

  const handleSend = () => {
    if (message.trim()) {
      // Aquí iría la lógica para enviar el mensaje
      setMessage("")
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <BackButton />
        <View style={styles.headerTextContainer}>
          <Text style={styles.subjectText}>{teacher.subject}</Text>
          <Text style={styles.nameText}>{teacher.name}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isUser={msg.isUser} />
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Send a message"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTextContainer: {
    alignItems: "center",
  },
  subjectText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  nameText: {
    fontSize: 16,
    color: "#666",
  },
  placeholder: {
    width: 30,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#B3D4FF",
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
})
