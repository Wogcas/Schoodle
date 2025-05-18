import { Stack } from "expo-router";
import { Colors } from "../constants/Colors";

/**
 * @function RootLayout
 * @description Functional component that sets up the main Stack Navigator for the application.
 * Uses a set of default screen options and defines the routes for the different app screens.
 * @returns {JSX.Element} The Stack Navigator component with the defined screens.
 */
export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: Colors.background },
                headerTitle: "",
                headerTintColor: Colors.text,
            }}>
            <Stack.Screen name="index" options={{
                title: "Home",
                contentStyle: { flex: 1, backgroundColor: Colors.background },
            }} />
            <Stack.Screen name="chat" options={{
                contentStyle: { flex: 1, backgroundColor: Colors.background },
            }} />
            <Stack.Screen name="notification" options={{
                contentStyle: { flex: 1, backgroundColor: Colors.background },
            }} />
            <Stack.Screen name="account" options={{
                contentStyle: { flex: 1, backgroundColor: Colors.background },
            }} />
            <Stack.Screen name="homework" options={{
                contentStyle: { flex: 1, backgroundColor: Colors.background },
            }} />
        </Stack>
    );
}