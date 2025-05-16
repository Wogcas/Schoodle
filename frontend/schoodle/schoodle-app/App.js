import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Main } from './components/Main';
import { Colors } from '../constants/Colors';
import { StatusBar } from 'react-native-web';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
                <Main />
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: Colors.background,
        },
    })