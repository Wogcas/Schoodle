import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { Link } from "expo-router"
import { Colors } from "../constants/Colors"

/**
 * @component ChatListItem
 * @description Componente para mostrar un chat en la lista de chats
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - ID único del chat
 * @param {string} props.title - Título del chat (nombre del profesor)
 * @param {string} props.subtitle - Subtítulo (rol o materia)
 * @param {string} props.lastMessage - Último mensaje
 * @param {string} props.time - Hora del último mensaje
 * @param {string} props.status - Estado del mensaje ('seen', 'pending', 'sent')
 * @param {string|Object} props.avatar - Fuente de la imagen de avatar
 * @returns {JSX.Element} Componente de item de chat
 */
const ChatListItem = ({ id, title, subtitle, lastMessage, time, status, avatar }) => {
  return (
    <Link href={`/chat/${id}`} asChild>
      <TouchableOpacity style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image source={typeof avatar === "string" ? { uri: avatar } : avatar} style={styles.avatar} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.titleText}>{title}</Text>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{time}</Text>
              <Text
                style={[
                  styles.statusText,
                  status === "seen"
                    ? styles.statusSeen
                    : status === "pending"
                      ? styles.statusPending
                      : styles.statusSent,
                ]}
              >
                {status}
              </Text>
            </View>
          </View>
          <Text style={styles.subtitleText}>{subtitle}</Text>
          <Text style={styles.messageText} numberOfLines={1} ellipsizeMode="tail">
            {lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.babyBlue,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  subtitleText: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: Colors.secondary,
  },
  timeContainer: {
    alignItems: "flex-end",
  },
  timeText: {
    fontSize: 12,
    color: Colors.secondary,
  },
  statusText: {
    fontSize: 12,
    marginTop: 2,
  },
  statusSeen: {
    color: Colors.darkBlue,
  },
  statusPending: {
    color: Colors.notificationRed,
  },
  statusSent: {
    color: Colors.secondary,
  },
})

export default ChatListItem
