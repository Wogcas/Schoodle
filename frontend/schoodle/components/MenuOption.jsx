import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { router } from "expo-router"

const MenuOption = ({ title, description, icon, route, backgroundColor = "#B3D1F0" }) => {
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor }]} onPress={() => router.push(route)}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#333",
  },
  arrow: {
    fontSize: 24,
    fontWeight: "bold",
  },
})

export default MenuOption
