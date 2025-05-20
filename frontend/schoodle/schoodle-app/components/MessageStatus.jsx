import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../constants/Colors"

/**
 * @component MessageStatus
 * @description Componente para mostrar el estado de un mensaje (enviado, entregado, visto)
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.status - Estado del mensaje ('sent', 'delivered', 'seen', 'pending')
 * @param {string} props.time - Hora del mensaje
 * @param {Object} props.style - Estilos adicionales
 * @returns {JSX.Element} Componente de estado de mensaje
 */
const MessageStatus = ({ status, time, style }) => {
  const getStatusIcon = () => {
    switch (status) {
      case "seen":
        return (
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-done" size={16} color={Colors.darkBlue} />
          </View>
        )
      case "delivered":
        return (
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-done" size={16} color={Colors.secondary} />
          </View>
        )
      case "sent":
        return (
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark" size={16} color={Colors.secondary} />
          </View>
        )
      case "pending":
        return (
          <View style={styles.iconContainer}>
            <Ionicons name="time-outline" size={16} color={Colors.secondary} />
          </View>
        )
      default:
        return null
    }
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.timeText}>{time}</Text>
      {getStatusIcon()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    color: Colors.secondary,
    marginRight: 4,
  },
  iconContainer: {
    marginLeft: 2,
  },
})

export default MessageStatus
