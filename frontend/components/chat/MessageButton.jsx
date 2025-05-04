import { View, Text, StyleSheet } from "react-native"

const MessageBubble = ({ message, isUser }) => {
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.teacherContainer]}>
      <Text style={styles.messageText}>{message.text}</Text>
      <Text style={styles.timeText}>{message.time}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
  },
  userContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#4A90E2",
    borderBottomRightRadius: 5,
  },
  teacherContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#FFE57F",
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
  timeText: {
    fontSize: 12,
    color: "#666",
    alignSelf: "flex-end",
    marginTop: 5,
  },
})

export default MessageBubble
