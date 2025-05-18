import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import ActionButton from './ActionButton.jsx';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NotificationButton from './NotificationButton.jsx';

/**
 * @component Main
 * @description The main screen component for the parent's section of the Schoodle app.
 * It displays a header with the app name and tagline, followed by a series of ActionButtons
 * that navigate to different sections of the app.
 *
 * @returns {View} The main screen view containing the header and action buttons.
 */
export function Main() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.notificationContainer}>
                <NotificationButton hasNotification />
            </View>
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <Text style={styles.appName}>Schoodle</Text>
                    <Text style={styles.tagline}>for parents</Text>
                </View>

            </View>

            <View style={styles.buttonsContainer}>
                <Link href="/chat" asChild>
                    <ActionButton
                        title="Chat"
                        subtitle="Talk to the teacher"
                        iconSource={require('../assets/images/chatting.png')}
                        buttonColor={Colors.blueButton}
                    />
                </Link>

                <Link href="/progress" asChild>
                    <ActionButton
                        title="Progress"
                        subtitle="Student progress"
                        iconSource={require('../assets/images/progress.png')}
                        buttonColor={Colors.yellowButton}
                    />
                </Link>

                <Link href="/homework" asChild>
                    <ActionButton
                        title="Homework"
                        subtitle="Assigned activities"
                        iconSource={require('../assets/images/homework.png')}
                        buttonColor={Colors.blueButton}
                    />
                </Link>

                <Link href="/account" asChild>
                    <ActionButton
                        title="Account"
                        subtitle="My account details"
                        iconSource={require('../assets/images/account.png')}
                        buttonColor={Colors.yellowButton}
                    />
                </Link>
            </View>
        </View>
    );
};

// Define the StyleSheet for styling the Main component.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        paddingTop: 20,
        paddingBottom: 30,
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: Colors.text,
    },
    tagline: {
        fontSize: 18,
        color: Colors.text,
    },
    notificationContainer: {
        alignItems: 'flex-end',
        paddingTop: 20,
        paddingRight: 30,
    },
    buttonsContainer: {
        paddingHorizontal: 20,
    },
});