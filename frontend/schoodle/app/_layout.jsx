import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { View } from "react-native"

export default function Layout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#EBF3FB" }}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#EBF3FB" },
        }}
      />
    </View>
  )
}
