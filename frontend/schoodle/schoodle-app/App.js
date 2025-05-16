import React from 'react';
import { View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import { Colors } from '../constants/Colors';

export default function App() {
    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <HomeScreen />
        </View>
    );
}