import React from "react";
import {
    View,
    Text,
    TouchableOpacity
} from "react-native";
import { useNavigation } from '@react-navigation/native';


export default function UserChoice() {
    const navigation = useNavigation(); // Use useNavigation hook to get the navigation object

    return (
        <View style={StyleSheet.container}>
            <TouchableOpacity>
                <Text>I am a caregiver</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('UserFormPati')} // Navigate using screen name
            >
                <Text>I am a patient</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text>I am a community volunteer</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('SafeView')}>
                <Text>Check Data</Text>
            </TouchableOpacity>
        </View>
    );
}
