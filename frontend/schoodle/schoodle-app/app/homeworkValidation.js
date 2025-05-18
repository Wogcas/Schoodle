import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DisplayHomework from '../components/DisplayHomework';
import { Colors } from '../constants/Colors';
import Header from '../components/Header';

/**
 * @constant {Object} mockHomeworkDetails
 * @description Mockup data for detailed homework information
 */
const mockHomeworkDetails = {
    'math': {
        '123': {
            title: 'Math',
            subtitle: 'Addition excercises 2',
            description: 'Observe the correct application of operations and the accurate outcome of the student\'s activities, ensuring proper understanding and execution of the operations.',
            submissionType: 'image',
            submissionContent: require('../assets/images/addition-homework.jpg'),
        },
    },
    'Distribuited System': {
        '124': {
            title: 'Distribuited System',
            subtitle: 'Task 2. UDP Practice',
            description: 'Review the implementation of UDP protocols and ensure proper networking concepts are applied.',
            submissionType: 'document',
            submissionContent: 'udp_practice_report.pdf',
        },
    },
};

/**
 * @component HomeworkValidation
 * @description Component for parents to validate student homework submissions
 * @returns {JSX.Element} The rendered component
 */
export default function HomeworkValidation() {
    const insets = useSafeAreaInsets();
    const { subjectId, assignmentId } = useLocalSearchParams();

    const homeworkDetail = mockHomeworkDetails[subjectId]?.[assignmentId];

    const [isExpanded, setIsExpanded] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);


    // Handle submission approval
    const handleSubmit = () => {
        if (isConfirmed) {
            setIsSubmitted(true);
            setIsExpanded(false);
        } else {
            alert('Please confirm that you have reviewed the homework');
        }
    };

    // If homework details aren't found
    if (!homeworkDetail) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <Text style={styles.title}>Homework not found</Text>
            </View>
        );
    }

    // Define the StyleSheet for styling the homeworkValidation.
    return (
        <ScrollView style={[styles.container, { paddingTop: insets.top }]}>

            <Header
                title={homeworkDetail.title}
            />

            <View style={styles.containerInstructions}>
                <Text style={styles.endorseTitle}>Endorse Assignment</Text>
                <Text style={styles.description}>{homeworkDetail.description}</Text>

            </View>


            <View style={styles.barContainer}>
                <View style={styles.bar}></View>
            </View>

            <DisplayHomework
                title={homeworkDetail.subtitle}
                isExpanded={isExpanded}
                isSubmitted={isSubmitted}
                onPress={() => {
                    if (!isSubmitted) {
                        setIsExpanded(!isExpanded);
                    }
                }}
            />
            {isSubmitted && !isExpanded && (
                <View style={styles.submissionSuccessContainer}>
                    <Text style={styles.submissionSuccessText}>The task has been submitted</Text>
                    <Link href="/homework" asChild>
                        <TouchableOpacity style={styles.doneButton}>
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            )}

            {isExpanded && (
                <View style={styles.submissionContainer}>
                    {homeworkDetail.submissionType === 'image' && (
                        <Image
                            source={homeworkDetail.submissionContent}
                            style={styles.submissionImage}
                            resizeMode="contain"
                        />
                    )}

                    <View style={styles.confirmationContainer}>
                        <TouchableOpacity
                            style={[
                                styles.confirmationBox,
                                isConfirmed && styles.confirmationBoxChecked
                            ]}
                            onPress={() => setIsConfirmed(!isConfirmed)}
                        >

                        </TouchableOpacity>
                        <Text style={styles.confirmationText}>
                            I confirm that I have thoroughly reviewed the student's work and approve its submission.
                        </Text>
                    </View>

                    {isSubmitted ? (
                        <Link href="/homework" asChild>
                            <TouchableOpacity style={[styles.submitButton, styles.submitButtonActive]}>
                                <Text style={styles.submitButtonText}>Return to homework list</Text>
                            </TouchableOpacity>
                        </Link>
                    ) : (
                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                isConfirmed ? styles.submitButtonActive : styles.submitButtonInactive
                            ]}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 20,
    },

    containerInstructions: {
        marginHorizontal: 35

    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 20,
    },
    endorseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: Colors.text,
        marginBottom: 1,
        lineHeight: 20,
    },
    barContainer: {
        paddingHorizontal: 10,
        marginVertical: 20
    },
    bar: {
        height: 3,
        width: '100%',
        backgroundColor: Colors.babyBlue
    },
    submissionContainer: {
        marginTop: 15,
    },
    submissionImage: {
        width: '100%',
        height: 200,
        marginBottom: 15,
        borderRadius: 8,
    },
    confirmationBox: {
        borderWidth: 1,
        borderColor: Colors.babyBlue,
        backgroundColor: '#E6EFFF',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
    },
    confirmationContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10

    },
    confirmationBoxChecked: {
        backgroundColor: Colors.darkBlue
    },
    confirmationText: {
        fontSize: 14,
        color: '#333',
    },
    submitButton: {
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonActive: {
        backgroundColor: Colors.darkBlue,
    },
    submitButtonInactive: {
        backgroundColor: Colors.babyBlue,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    submissionSuccessContainer: {
        alignItems: 'center',
        marginVertical: 50

    },
    doneButtonText: {
        color: Colors.darkBlue,
        fontSize: 20,
        marginVertical: 20,
        fontWeight: 'bold'

    },
});