import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import ActionButton from './ActionButton';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Main() {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.appName}>Schoodle</Text>
                <Text style={styles.tagline}>for parents</Text>
            </View>

            <View style={styles.buttonsContainer}>
                <Link href="/Chat" asChild>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    header: {
        paddingHorizontal: 20,
        paddingTop: 40,
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
    buttonsContainer: {
        paddingHorizontal: 20,
    },
});

