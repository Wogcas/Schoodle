import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';

/**
 * @constant {Array<Object>} mockHomework
 * @description An array of objects simulating homework assignments. Each object
 * contains details such as the assignment ID, title, subtitle, description,
 * due time, status, destination screen for navigation, and parameters for that screen.
 */
const mockHomework = [
    {
        id: '1',
        title: 'Math',
        subtitle: 'Addition excercises 2',
        description: 'Observe the correct application of formulas.',
        time: '15:00',
        status: 'pending',
        destinationScreen: 'homeworkValidation',
        params: { subjectId: 'math', assignmentId: '123' }
    },
    {
        id: '2',
        title: 'Distribuited System',
        subtitle: 'Task 2. UDP Practice',
        time: '9:30',
        status: 'sent',
        destinationScreen: 'homeworkValidation',
        params: { subjectId: 'Distribuited System', assignmentId: '124' }
    },
];
/**
 * @component homework
 * @description This component renders the homework board screen. It displays a
 * list of homework assignments that can be filtered using the `SearchBar`.
 * Tapping on a homework item navigates the user to the detailed homework screen.
 *
 * @returns {View} The main view of the homework board screen.
 */
export default function homework() {
    const insets = useSafeAreaInsets();
    const [filteredArray, setFilteredHomework] = useState(mockHomework);

    return (
        <ScrollView style={[styles.container, { paddingTop: 10 + insets.top }]}>
            <Header
                title="Homework board"
            />
            <SearchBar
                arrayToFilter={mockHomework}
                onFilterChange={setFilteredHomework}
            />

            <View >
                {filteredArray.length > 0 ? (
                    filteredArray.map((homework) => (
                        <Link
                            key={homework.id}
                            href={{
                                pathname: `/${homework.destinationScreen}`,
                                params: homework.params
                            }}
                            asChild
                        >
                            <TouchableOpacity>
                                <ItemCard
                                    title={homework.title}
                                    subtitle={homework.subtitle}
                                    description={homework.description}
                                    time={homework.time}
                                    status={homework.status}
                                />
                            </TouchableOpacity>
                        </Link>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No homework found</Text>
                    </View>
                )}
            </View>

        </ScrollView>
    );

};

// Define the StyleSheet for styling the homework.
const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: Colors.background,
        paddingEnd: 20,
        paddingStart: 20,
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