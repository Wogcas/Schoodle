import { View, StyleSheet, TouchableOpacity, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Header from "../../components/Header"
import ChatListItem from "../../components/ChatListItem"

// Importa las imágenes de avatar que necesitas
const womenAvatar = require("../../assets/women-teacher-avatar.png")
const menAvatar = require("../../assets/men-teacher-avatar.png")

export default function ChatListScreen() {
  const NewChatButton = () => (
    <TouchableOpacity style={styles.newChatButton}>
      <Text style={styles.newChatText}>New chat +</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Header title="Chat" showBackButton={true} rightComponent={<NewChatButton />} />

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <Text style={styles.searchPlaceholder}>Search</Text>
      </View>

      <View style={styles.chatList}>
        <ChatListItem
          id="math"
          role="Math"
          name="Carla Lopez"
          preview="Hello, teacher. I wanted to ask..."
          avatar={womenAvatar}
          time="9:30"
          status="seen"
        />
        <ChatListItem
          id="homeroom"
          role="Homeroom teacher"
          name="Silvia Sánchez"
          preview="I wanted to update you on your..."
          avatar={womenAvatar}
          time="9:30"
          status="pending"
        />
        <ChatListItem
          id="english"
          role="English teacher"
          name="Simon Tyson"
          preview="I hope you're doing well. I..."
          avatar={menAvatar}
          time="9:30"
          status="sent"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  newChatButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  newChatText: {
    color: "#4A90E2",
    fontWeight: "500",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B3D1F0",
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    color: "#666",
  },
  chatList: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
  },
})
