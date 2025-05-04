import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { router } from "expo-router"

const ChatListItem = ({ id, name, role, preview, avatar, time, status }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => router.push(`/chat/${id}`)}>
      <Image source={avatar} style={styles.avatar} />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{role}</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{time}</Text>
            {status && <Text style={styles.status}>{status}</Text>}
          </View>
        </View>
        <Text style={styles.teacherName}>{name}</Text>
        <Text style={styles.preview} numberOfLines={1}>
          {preview}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  teacherName: {
    fontSize: 14,
    color: "#666",
  },
  preview: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  timeContainer: {
    alignItems: "flex-end",
  },
  time: {
    fontSize: 12,
    color: "#4A90E2",
  },
  status: {
    fontSize: 12,
    color: "#4A90E2",
  },
})

export default ChatListItem
