import { Stack } from "expo-router";
import { Colors } from "../constants/Colors";


export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: Colors.background },
                headerTitle: "",
                headerTintColor: Colors.text
            }}>
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen name="Chat" />
        </Stack>
    );
}