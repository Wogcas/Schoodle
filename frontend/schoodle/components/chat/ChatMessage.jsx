import { View, Text, StyleSheet } from "react-native"

const ChatMessage = ({ message, time, isUser = false }) => {
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.otherContainer]}>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    borderRadius: 20,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  userContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#4A90E2",
  },
  otherContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#FFE57F",
  },
  message: {
    fontSize: 16,
    color: "#000",
  },
  time: {
    fontSize: 12,
    color: "#666",
    alignSelf: "flex-end",
    marginTop: 5,
  },
})

export default ChatMessage
