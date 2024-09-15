// UserChoice.js

import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function UserChoice() {
    const navigation = useNavigation(); // Use useNavigation hook to get the navigation object

    // Define your Flask backend URL
    // Replace '192.168.1.100' with your Flask server's local IP address
    const FLASK_SERVER_URL = "http://192.168.1.100:5000/predict"; // Update accordingly

    // Function to handle navigation for Caregiver and Community Volunteer
    const handleCaregiverPress = () => {
        Alert.alert("Caregiver Button Pressed");
        // Add navigation or other actions here if needed
    };

    const handleVolunteerPress = () => {
        Alert.alert("Community Volunteer Button Pressed");
        // Add navigation or other actions here if needed
    };

    // Function to send mock fall data to the backend
    const sendMockData = async () => {
        const mockFallData = {
            accelerometer: { x: -5.365798, y: 0.076309, z: 6.320082 }, // Example high acceleration simulating a fall
            gyroscope: { x: 0.012291, y: 2.365048, z: -0.219213 }       // Minimal angular velocity
        };

        try {
            const response = await axios.post(FLASK_SERVER_URL, mockFallData);
            const { fall_detected, predicted_activity } = response.data;

            if (fall_detected) {
                Alert.alert(
                    "Fall Detected",
                    "Did you fall?",
                    [
                        {
                            text: "No",
                            onPress: () => {
                                console.log("User: No");
                                // Optionally, you can perform actions here
                            },
                            style: "cancel",
                        },
                        {
                            text: "Yes",
                            onPress: () => {
                                console.log("User: Yes");
                                Alert.alert("Alert", "Sending help to your location.");
                                // Implement further actions here (e.g., send alerts to contacts)
                            },
                        },
                    ],
                    { cancelable: false }
                );
            } else {
                console.log(`Predicted Activity: ${predicted_activity}`);
                Alert.alert("Prediction", `Predicted Activity: ${predicted_activity}`);
            }
        } catch (error) {
            console.error("Error sending mock data:", error.message);
            Alert.alert("Error", "Failed to send mock data to the server.");
        }
    };

    return (
        <View style={{ 
            flex: 1, 
            padding: 20, 
            backgroundColor: "#fff", 
            justifyContent: "center", 
            alignItems: "center" 
        }}>
            <TouchableOpacity 
                style={{
                    padding: 15,
                    marginVertical: 10,
                    backgroundColor: "#007AFF",
                    borderRadius: 8,
                    width: "80%",
                    alignItems: "center",
                }}
                onPress={handleCaregiverPress}
            >
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                    I am a caregiver
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    padding: 15,
                    marginVertical: 10,
                    backgroundColor: "#007AFF",
                    borderRadius: 8,
                    width: "80%",
                    alignItems: "center",
                }}
                onPress={() => navigation.navigate('UserFormPati')} // Navigate using screen name
            >
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                    I am a patient
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={{
                    padding: 15,
                    marginVertical: 10,
                    backgroundColor: "#007AFF",
                    borderRadius: 8,
                    width: "80%",
                    alignItems: "center",
                }}
                onPress={handleVolunteerPress}
            >
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                    I am a community volunteer
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    padding: 15,
                    marginVertical: 10,
                    backgroundColor: "#FF3B30",
                    borderRadius: 8,
                    width: "80%",
                    alignItems: "center",
                }}
                onPress={() => navigation.navigate('SafeView')}
            >
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                    Check Data
                </Text>
            </TouchableOpacity>

            {/* Simulate Fall Button */}
            <TouchableOpacity
                style={{
                    padding: 15,
                    marginVertical: 20,
                    backgroundColor: "#FF9500", // Orange color to distinguish
                    borderRadius: 8,
                    width: "80%",
                    alignItems: "center",
                }}
                onPress={sendMockData}
            >
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                    Simulate Fall
                </Text>
            </TouchableOpacity>
        </View>
    );
}
 