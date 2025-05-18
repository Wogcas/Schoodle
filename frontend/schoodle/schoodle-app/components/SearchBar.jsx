import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';


/**
 * SearchBar component that filters notifications in real time
 * @param {Array} arrayToFilter - Array of notifications to filter
 * @param {Function} onFilterChange - Callback function that receives the filtered notifications
 * @returns {JSX.Element}
 */
const SearchBar = ({ arrayToFilter = [], onFilterChange }) => {
    const [searchText, setSearchText] = useState('');

    // Effect to filter notifications when text changes
    useEffect(() => {
        if (searchText.trim() === '') {
            onFilterChange && onFilterChange(arrayToFilter);
            return;
        }

        const filteredArray = arrayToFilter.filter(item => {
            const searchTextLower = searchText.toLowerCase();

            return (
                (item.title && item.title.toLowerCase().includes(searchTextLower)) ||
                (item.subtitle && item.subtitle.toLowerCase().includes(searchTextLower)) ||
                (item.description && item.description.toLowerCase().includes(searchTextLower))
            );
        });

        onFilterChange && onFilterChange(filteredArray);
    }, [searchText, arrayToFilter]);

    const handleClearSearch = () => {
        setSearchText('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#8C8C8C" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Search"
                    placeholderTextColor="#8C8C8C"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={18} color="#8C8C8C" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

// Define the StyleSheet for styling the SearchBar component.
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.babyBlue,
        borderRadius: 20,
        paddingHorizontal: 12,
        height: 40,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
        height: '100%',
        padding: 0,
    },
    clearButton: {
        padding: 4,
    }
});

export default SearchBar;