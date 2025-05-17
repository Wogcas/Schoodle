import Header from "../components/Header"
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import ActionButton from "../components/ActionButton";
import { Link } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * @screen account
 * @description This screen displays the user's profile
 * information and provides navigation options to account-related settings.
 *
 * @returns {View} The main view of the account screen, including the header,
 * profile information, and action buttons.
 */
export default function account() {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Header
                title="Account"
            />
            <View style={styles.profileContainer}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={require('../assets/images/ic_account.png')}
                        style={styles.profileImage}
                    />
                </View>
                <Text style={styles.name}>Daryl Dixon</Text>
                <Text style={styles.subtitle}>Laurent Carriere's Guardian</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <Link href="/" asChild>
                    <ActionButton
                        title="Personal Info"
                        iconSource={require('../assets/images/ic_personalinfo.png')}
                        buttonColor={Colors.blueButton}
                        showIconBackground={false}
                    />
                </Link>

                <Link href="/" asChild>
                    <ActionButton
                        title="Notifications"
                        iconSource={require('../assets/images/ic_notifications.png')}
                        buttonColor={Colors.yellowButton}
                        showIconBackground={false}
                    />
                </Link>

                <Link href="/" asChild>
                    <ActionButton
                        title="Password"
                        iconSource={require('../assets/images/ic_password.png')}
                        buttonColor={Colors.blueButton}
                        showIconBackground={false}
                    />
                </Link>
            </View>
        </View>

    )

};

// Define the StyleSheet for styling the AccountScreen.
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        display: "flex",
        flexDirection: "column"
    },

    header: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 30,
    },

    profileContainer: {
        alignItems: 'center',
        paddingVertical: 30,
    },

    profileImageContainer: {

        padding: 10,
    },

    profileImage: {
        width: 80,
        height: 80,

    },

    name: {
        fontWeight: "bold",
        fontSize: 30

    },

    subtitle: {
        marginTop: 2,
        fontWeight: "semibold",
        fontSize: 15

    },

    buttonsContainer: {
        paddingHorizontal: 20,
    },
});
