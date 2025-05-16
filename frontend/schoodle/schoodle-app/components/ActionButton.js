import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';


const ActionButton = ({ title, subtitle, iconSource, onPress, buttonColor = '#AED6F1' }) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: buttonColor }]}
            onPress={onPress}
        >
            <View style={styles.contentContainer}>
                <View style={styles.iconContainer}>
                    <Image source={iconSource} style={styles.icon} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
                <Feather name="chevron-right" size={24} color="#687076" />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 16,
        marginBottom: 15,
        overflow: 'hidden',
        width: '100%',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        backgroundColor: Colors.background,
        borderRadius: 8,
    },
    icon: {
        width: 36,
        height: 36,
        resizeMode: 'contain',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
    },
    subtitle: {
        fontSize: 14,
        color: '#000000',
    },
});


export default ActionButton;