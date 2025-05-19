"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../constants/Colors"
import ChatMessage from "./ChatMessage"

/**
 * @component ChatScreen
 * @description Componente para la pantalla de chat individual
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.teacher - Información del profesor
 * @param {Array} props.messages - Lista de mensajes
 * @param {Function} props.onSendMessage - Función para enviar un mensaje
 * @param {boolean} props.showBackButton - Si se debe mostrar el botón de atrás
 * @returns {JSX.Element} Componente de pantalla de chat
 */
const ChatScreen = ({ teacher, messages = [], onSendMessage, showBackButton = false }) => {
  const [newMessage, setNewMessage] = useState("")
  const router = useRouter()

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage)
      setNewMessage("")
    }
  }

  const renderMessage = ({ item }) => (
    <ChatMessage text={item.text} time={item.time} isOwn={item.isOwn} status={item.status} />
  )

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        {showBackButton && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{teacher?.title}</Text>
          <Text style={styles.headerSubtitle}>{teacher?.name}</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesContainer}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Send a message"
          placeholderTextColor={Colors.secondary}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={!newMessage.trim()}>
          <Ionicons name="send" size={24} color={newMessage.trim() ? Colors.primary : Colors.secondary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  backButton: {
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.secondary,
  },
  messagesContainer: {
    paddingVertical: 15,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 15,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    backgroundColor: Colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    width: 44,
    height: 44,
  },
})

export default ChatScreen
