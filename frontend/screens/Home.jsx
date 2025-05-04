import { StyleSheet, View, Text, Image, ScrollView } from "react-native"
import MenuButton from "../components/MenuButton"
import { useNavigation } from "@react-navigation/native"

// Importamos los íconos para cada botón
import chatIcon from "../assets/chat-icon.png"
import progressIcon from "../assets/progress-icon.png"
import homeworkIcon from "../assets/homework-icon.png"
import accountIcon from "../assets/account-icon.png"
import notificationIcon from "../assets/notification-icon.png"

export default function HomeScreen() {
  const navigation = useNavigation()

  // Datos para los botones del menú
  const menuItems = [
    {
      id: "chat",
      icon: chatIcon,
      title: "Chat",
      subtitle: "Talk to the teacher",
      bgColor: "#C5D9F1",
      onPress: () => navigation.navigate("ChatList"),
    },
    {
      id: "progress",
      icon: progressIcon,
      title: "Progress",
      subtitle: "Student progress",
      bgColor: "#FFF2B2",
      onPress: () => console.log("Progress pressed"),
    },
    {
      id: "homework",
      icon: homeworkIcon,
      title: "Homework",
      subtitle: "Assigned activities",
      bgColor: "#C5D9F1",
      onPress: () => console.log("Homework pressed"),
    },
    {
      id: "account",
      icon: accountIcon,
      title: "Account",
      subtitle: "My account details",
      bgColor: "#FFF2B2",
      onPress: () => console.log("Account pressed"),
    },
  ]

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Schoodle</Text>
          <Text style={styles.logoSubtext}>for parents</Text>
        </View>
        <View style={styles.notificationContainer}>
          <Image source={notificationIcon} style={styles.notificationIcon} />
          <View style={styles.notificationBadge} />
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <MenuButton
            key={item.id}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            bgColor={item.bgColor}
            onPress={item.onPress}
          />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: "column",
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
  },
  logoSubtext: {
    fontSize: 18,
    color: "#000",
    marginTop: -5,
  },
  notificationContainer: {
    position: "relative",
  },
  notificationIcon: {
    width: 30,
    height: 30,
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
    marginTop: 20,
  },
})
