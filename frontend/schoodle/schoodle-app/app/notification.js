import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';

/**
 * @constant {Array<Object>} mockNotifications
 * @description An array of objects that simulates notification data. Each object
 * represents a notification with properties such as id, title, subtitle, description,
 * time, status, destination screen, and parameters for navigation.
 */
const mockNotifications = [
    {
        id: '1',
        title: 'Math Homework',
        subtitle: 'Endorse assignment',
        description: 'Observe the correct application of formulas.',
        time: '15:00',
        status: 'pending',
        destinationScreen: 'homework',
        params: { subjectId: 'math', assignmentId: '123' }
    },
    {
        id: '2',
        title: 'Teacher Message',
        subtitle: 'Silvia Sánchez',
        description: 'I wanted to update you on your child\'s progress.',
        time: '9:30',
        status: 'pending',
        destinationScreen: 'messages',
        params: { teacherId: 'silvia-sanchez', messageId: '456' }
    },
    {
        id: '3',
        title: 'Math Homework',
        subtitle: 'Assignment sent',
        description: 'Your child has submitted the math homework.',
        time: 'Mar 1',
        status: 'seen',
        destinationScreen: 'homework',
        params: { subjectId: 'math', assignmentId: '789' }
    },
    {
        id: '4',
        title: 'Math Homework',
        subtitle: 'Assignment sent',
        description: 'Your child has submitted the math homework.',
        time: 'Mar 1',
        status: 'seen',
        destinationScreen: 'homework',
        params: { subjectId: 'math', assignmentId: '101' }
    },
    {
        id: '5',
        title: 'Chemistry Homework',
        subtitle: 'Assignment sent',
        description: 'Your child has submitted the chemistry homework.',
        time: 'Feb 27',
        status: 'seen',
        destinationScreen: 'homework',
        params: { subjectId: 'chemistry', assignmentId: '112' }
    },
    {
        id: '6',
        title: 'Performance Alert',
        subtitle: 'Chemistry class',
        description: 'Your child has not been completing the required assignments.',
        time: 'Feb 27',
        status: 'seen',
        destinationScreen: 'performance',
        params: { subjectId: 'chemistry', studentId: '123' }
    }
];

/**
 * @function notification
 * @description Functional component that renders the notifications screen.
 * It displays a list of notifications that can be filtered using a
 * SearchBar component. Each notification is shown using the ItemCard
 * component, and tapping on it navigates to the screen specified in
 * destinationScreen, passing the parameters defined in params.
 * @returns {JSX.Element} The structure of the notifications screen.
 */
export default function notification() {
    const insets = useSafeAreaInsets();
    const [filteredNotifications, setFilteredNotifications] = useState(mockNotifications);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Header
                title="Notifications"
            />
            <SearchBar
                notifications={mockNotifications}
                onFilterChange={setFilteredNotifications}
            />

            <ScrollView style={styles.notificationContainer}>
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                        <Link
                            key={notification.id}
                            href={{
                                pathname: `/${notification.destinationScreen}`,
                                params: notification.params
                            }}
                            asChild
                        >
                            <TouchableOpacity>
                                <ItemCard
                                    title={notification.title}
                                    subtitle={notification.subtitle}
                                    description={notification.description}
                                    time={notification.time}
                                    status={notification.status}
                                />
                            </TouchableOpacity>
                        </Link>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No se encontraron notificaciones</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

// Define the StyleSheet for styling the notification.
const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: Colors.background
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50
    },

    emptyText: {
        fontSize: 16,
        color: Colors.babyBlue,
        fontWeight: '500'
    }


});
