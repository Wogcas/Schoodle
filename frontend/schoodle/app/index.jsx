import { View, Text, StyleSheet, Image } from "react-native"
import MenuOption from "../components/MenuOption"

// Importa las imágenes que necesitas
const chatIcon = require("../assets/chat-icon.png")
const progressIcon = require("../assets/progress-icon.png")
const homeworkIcon = require("../assets/homework-icon.png")
const accountIcon = require("../assets/account-icon.png")
const notificationIcon = require("../assets/notification-icon.png")

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Schooldle</Text>
        <Text style={styles.subtitle}>for parents</Text>
        <View style={styles.notificationContainer}>
          <Image source={notificationIcon} style={styles.notificationIcon} />
          <View style={styles.notificationBadge} />
        </View>
      </View>

      <View style={styles.menuContainer}>
        <MenuOption
          title="Chat"
          description="Talk to the teacher"
          icon={chatIcon}
          route="/chat"
          backgroundColor="#B3D1F0"
        />
        <MenuOption
          title="Progress"
          description="Student progress"
          icon={progressIcon}
          route="/progress"
          backgroundColor="#FFE57F"
        />
        <MenuOption
          title="Homework"
          description="Assigned activities"
          icon={homeworkIcon}
          route="/homework"
          backgroundColor="#B3D1F0"
        />
        <MenuOption
          title="Account"
          description="My account details"
          icon={accountIcon}
          route="/account"
          backgroundColor="#FFE57F"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginLeft: 5,
    alignSelf: "flex-end",
    marginBottom: 5,
  },
  notificationContainer: {
    marginLeft: "auto",
    position: "relative",
  },
  notificationIcon: {
    width: 24,
    height: 24,
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },
  menuContainer: {
    flex: 1,
  },
})
