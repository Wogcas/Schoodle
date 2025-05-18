import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '../constants/Colors';

/**
 * @component ItemCard
 * @description This component renders a card displaying the details of a single notification item.
 * It shows the title, subtitle, description, timestamp, and status of the notification.
 * The status text's appearance changes based on whether the notification is 'pending' or 'seen'.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.title - The main title of the notification. Required.
 * @param {string} [props.subtitle] - The subtitle or sender of the notification. Optional.
 * @param {string} [props.description] - A brief description of the notification. Optional.
 * @param {string} props.time - The timestamp of the notification. Required.
 * @param {string} [props.status='pending'] - The status of the notification ('pending' or 'seen'). Defaults to 'pending'.
 *
 * @returns {View} A View component displaying the notification information.
 */
const ItemCard = ({ title, subtitle, description, time, status = "pending" }) => {
    const statusStyle = status === 'pending' ? styles.statusPending : styles.statusSeen;

    return (
        <View style={styles.container}>
            <View style={styles.notificationInformation}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
                <Text style={styles.description} numberOfLines={1}>{description}</Text>
            </View>
            <View style={styles.timeStatus}>
                <Text style={styles.time}>{time}</Text>
                <Text style={[styles.statusBase, statusStyle]}>{status}</Text>
            </View>
            <View style={styles.barContainer}>
                <View style={styles.bar}></View>
            </View>
        </View>
    );
};

// Define the expected prop types for the ActionButton component.
ItemCard.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    description: PropTypes.string,
    time: PropTypes.string.isRequired,
    status: PropTypes.string,
};

// Define the StyleSheet for styling the ItemCard component.
const styles = StyleSheet.create({
    container: {
        paddingVertical: 14,
        paddingHorizontal: 10,
        position: 'relative'
    },
    notificationInformation: {
        flex: 1,
        paddingRight: 80
    },
    timeStatus: {
        position: 'absolute',
        right: 16,
        top: 14,
        alignItems: 'flex-end'
    },
    barContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 10
    },
    bar: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.babyBlue
    },
    title: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: 'bold',
        marginBottom: 2
    },
    subtitle: {
        fontSize: 14,
        color: Colors.text,
        fontWeight: '500',
        marginBottom: 2
    },
    description: {
        fontSize: 12,
        color: Colors.text,
        marginBottom: 2
    },
    time: {
        fontSize: 12,
        color: Colors.babyBlue,
        marginBottom: 4
    },
    statusBase: {
        fontSize: 12,
        fontWeight: '500'
    },
    statusPending: {
        color: Colors.notificationRed
    },
    statusSeen: {
        color: Colors.babyBlue
    }
});

export default ItemCard;