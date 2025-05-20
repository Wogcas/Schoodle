import { View, Text, StyleSheet } from "react-native"
import { Colors } from "../constants/Colors"

/**
 * @component ChatMessage
 * @description Componente reutilizable para mostrar un mensaje individual en el chat
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.text - Texto del mensaje
 * @param {string} props.time - Hora del mensaje (formato: HH:MM)
 * @param {boolean} props.isOwn - Si el mensaje es del usuario actual
 * @param {string} props.status - Estado del mensaje ('sent', 'delivered', 'seen', 'pending')
 * @returns {JSX.Element} Componente de mensaje
 */
const ChatMessage = ({ text, time, isOwn, status }) => {
  return (
    <View style={[styles.container, isOwn ? styles.ownMessage : styles.otherMessage]}>
      <Text style={styles.messageText}>{text}</Text>
      <View style={styles.messageFooter}>
        <Text style={styles.timeText}>{time}</Text>
        {isOwn && (
          <Text style={styles.statusText}>
            {status === "seen" ? "✓✓" : status === "delivered" ? "✓✓" : status === "sent" ? "✓" : ""}
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    borderRadius: 20,
    padding: 12,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  ownMessage: {
    alignSelf: "flex-end",
    backgroundColor: Colors.darkBlue,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: Colors.yellowButton,
  },
  messageText: {
    color: Colors.text,
    fontSize: 16,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    color: Colors.text,
    opacity: 0.7,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: Colors.text,
    opacity: 0.7,
  },
})

export default ChatMessage
