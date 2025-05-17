import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

/**
 * @component Header
 * @description A header component that displays a title.
 *
 * @param {object} props - The component's props.
 * @param {string} props.title - The text to be displayed in the header. **Required**.
 *
 * @returns {View} A View containing the title text with specified styling.
 */
const Header = ({ title }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>
                {title}
            </Text>
        </View>
    )

};

// Define the expected prop types for the Header component.
Header.propTypes = {
    title: PropTypes.string.isRequired,
};

// Define the StyleSheet for styling the Header component.
const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 30,
        paddingBottom: 10,

    },
    title: {
        color: Colors.text,
        fontSize: 30,
        fontWeight: 'bold',
    },
});

export default Header;