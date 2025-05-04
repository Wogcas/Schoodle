import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"

const ChatListItem = ({ teacher, preview, time, status, avatar }) => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigation.navigate("ChatDetail", { teacher })}>
      <Image source={avatar} style={styles.avatar} />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.subjectText}>{teacher.subject}</Text>
          <Text
            style={[
              styles.timeText,
              status === "seen" ? styles.seenText : status === "pending" ? styles.pendingText : styles.sentText,
            ]}
          >
            {time}
          </Text>
        </View>
        <Text style={styles.nameText}>{teacher.name}</Text>
        <Text style={styles.previewText} numberOfLines={1}>
          {preview}
        </Text>
        {status === "seen" && <Text style={styles.statusText}>seen</Text>}
        {status === "pending" && <Text style={styles.pendingStatusText}>pending</Text>}
        {status === "sent" && <Text style={styles.statusText}>sent</Text>}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#D1E3FF",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subjectText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  nameText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  previewText: {
    fontSize: 14,
    color: "#666",
  },
  timeText: {
    fontSize: 12,
  },
  seenText: {
    color: "#4A90E2",
  },
  pendingText: {
    color: "#F5A623",
  },
  sentText: {
    color: "#4A90E2",
  },
  statusText: {
    fontSize: 12,
    color: "#4A90E2",
    alignSelf: "flex-end",
  },
  pendingStatusText: {
    fontSize: 12,
    color: "#F5A623",
    alignSelf: "flex-end",
  },
})

export default ChatListItem
