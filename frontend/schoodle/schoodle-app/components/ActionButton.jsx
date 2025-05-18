import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import PropTypes from 'prop-types';

/**
 * @component ActionButton
 * @description A reusable button component with an icon, title, and optional subtitle.
 * It provides customization options for the button color and icon background visibility.
 *
 * @param {object} props - The component's props.
 * @param {string} props.title - The main text displayed on the button. **Required**.
 * @param {string} [props.subtitle] - The secondary text displayed below the title. Optional.
 * @param {number|object} props.iconSource - The source of the icon image. Can be a local image path (number) or an asset object. **Required**.
 * @param {function} [props.onPress] - A function to be called when the button is pressed.
 * @param {string} [props.buttonColor='#AED6F1'] - The background color of the button. Defaults to '#AED6F1'.
 * @param {boolean} [props.showIconBackground=true] - A boolean indicating whether to show a background color behind the icon. Defaults to true.
 *
 * @returns {TouchableOpacity} A touchable button element with the specified content and styling.
 */
const ActionButton = ({ title, subtitle, iconSource, onPress, buttonColor = '#AED6F1', showIconBackground = true }) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: buttonColor }]}
            onPress={onPress}
        >
            <View style={styles.contentContainer}>
                <View style={[
                    styles.iconContainer,
                    showIconBackground && { backgroundColor: Colors.background }
                ]}>
                    <Image source={iconSource} style={styles.icon} />
                </View>
                <View style={[
                    styles.textContainer,
                    !subtitle && styles.textContainerCentered
                ]}>
                    <Text style={styles.title}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
                <Feather name="chevron-right" size={24} color="#687076" />
            </View>
        </TouchableOpacity>
    );
};

// Define the expected prop types for the ActionButton component.
ActionButton.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    iconSource: PropTypes.oneOfType([PropTypes.number, PropTypes.object]).isRequired,
    onPress: PropTypes.func,
    buttonColor: PropTypes.string,
    showIconBackground: PropTypes.bool,
};

// Define the StyleSheet for styling the ActionButton component.
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
        borderRadius: 8,
    },
    icon: {
        width: 36,
        height: 36,
        resizeMode: 'contain',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    textContainerCentered: {
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        textAlignVertical: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: Colors.text,
    },
});

export default ActionButton;