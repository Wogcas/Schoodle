import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

export default function Chat() {
    return (
        <ScrollView>
            <Text style={styles.container}>
                En desarrollo
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        fontSize: 18,
    },
});