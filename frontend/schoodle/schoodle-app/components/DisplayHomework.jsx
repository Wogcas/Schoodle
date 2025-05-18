import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Colors } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';

/**
 * @component DisplayHomework
 * @description A component that displays homework details and can expand to show submission
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The title of the homework assignment
 * @param {boolean} props.isExpanded - Whether the component is expanded to show submission
 * @param {Function} props.onPress - Function to call when the component is pressed
 * @returns {JSX.Element} The rendered component
 */
export default function DisplayHomework({
    title,
    isExpanded,
    isSubmitted,
    onPress
}) {
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(rotation, {
            toValue: isExpanded ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isExpanded, rotation]);

    const rotateInterpolate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'],
    });

    const animatedStyle = {
        transform: [{ rotate: rotateInterpolate }],
    };

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.loadText}>
                    {isExpanded ? '' : isSubmitted ? 'Homework checked.' : 'Load full homework'}
                </Text>
            </View>

            <Animated.View style={[animatedStyle]}>
                <Feather name="chevron-right" size={24} color="#687076" />
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.yellowButton,
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    loadText: {
        fontSize: 14,
        color: Colors.text,
    },
    chevron: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});