"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import BackButton from "../components/BackButton"
import ChatListItem from "../components/ChatListItem"


import womenAvatar from "../assets/women-teacher-avatar.png"
import menAvatar from "../assets/english-teacher-avatar.png"

export default function ChatList() {
  const [searchQuery, setSearchQuery] = useState("")

  const chats = [
    {
      id: "1",
      teacher: {
        subject: "Math",
        name: "Carla Lopez",
      },
      preview: "Hello, teacher. I wanted to ask...",
      time: "9:30",
      status: "seen",
      avatar: womenAvatar,
    },
    {
      id: "2",
      teacher: {
        subject: "Homeroom teacher",
        name: "Silvia Sánchez",
      },
      preview: "I wanted to update you on your...",
      time: "9:30",
      status: "pending",
      avatar: womenAvatar,
    },
    {
      id: "3",
      teacher: {
        subject: "English teacher",
        name: "Simon Tyson",
      },
      preview: "I hope you're doing well. I...",
      time: "9:30",
      status: "sent",
      avatar: menAvatar,
    },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Chat</Text>
        <TouchableOpacity style={styles.newChatButton}>
          <Text style={styles.newChatText}>New chat</Text>
          <Ionicons name="add" size={18} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Search" value={searchQuery} onChangeText={setSearchQuery} />
      </View>

      <ScrollView style={styles.chatList}>
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            teacher={chat.teacher}
            preview={chat.preview}
            time={chat.time}
            status={chat.status}
            avatar={chat.avatar}
          />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  newChatText: {
    fontSize: 16,
    color: "#4A90E2",
    marginRight: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B3D4FF",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  chatList: {
    flex: 1,
  },
})
