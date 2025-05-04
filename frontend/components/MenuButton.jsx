import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const MenuButton = ({ icon, title, subtitle, bgColor, onPress }) => {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: bgColor }]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Image source={icon} style={styles.icon} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#555" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  textContainer: {
    flexDirection: "column",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#333",
  },
})

export default MenuButton
