import { TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

const BackButton = () => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
      <Ionicons name="chevron-back" size={28} color="#000" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  backButton: {
    padding: 5,
  },
})

export default BackButton
