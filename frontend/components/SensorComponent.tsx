import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Button, Alert, Platform } from "react-native";
import { Accelerometer, Gyroscope } from "expo-sensors";
import axios from "axios";
import debounce from "lodash.debounce";

// Define the SensorSubscription interface
interface SensorSubscription {
    remove: () => void;
}

interface SensorData {
    x: number;
    y: number;
    z: number;
}

const SensorsComponent: React.FC = () => {
    const [accelerometerData, setAccelerometerData] = useState<SensorData>({
        x: 0,
        y: 0,
        z: 0,
    });
    const [gyroscopeData, setGyroscopeData] = useState<SensorData>({
        x: 0,
        y: 0,
        z: 0,
    });
    const [accelerometerSubscription, setAccelerometerSubscription] =
        useState<SensorSubscription | null>(null);
    const [gyroscopeSubscription, setGyroscopeSubscription] =
        useState<SensorSubscription | null>(null);
    const [accelerometerAvailable, setAccelerometerAvailable] =
        useState<boolean>(true);
    const [gyroscopeAvailable, setGyroscopeAvailable] = useState<boolean>(true);

    // Replace with your Flask server's IP address and port
    const FLASK_SERVER_URL = "http://0.0.0.0:5000/predict";

    useEffect(() => {
        if (Platform.OS === "web") {
            Alert.alert(
                "Unsupported Platform",
                "Sensors are not supported on the web platform. Using mock data."
            );
            // Initialize mock data
            const mockAccelerometer = setInterval(() => {
                setAccelerometerData({
                    x: parseFloat((Math.random() * 10 - 5).toFixed(2)),
                    y: parseFloat((Math.random() * 10 - 5).toFixed(2)),
                    z: parseFloat((Math.random() * 10 - 5).toFixed(2)),
                });
            }, 1000); // Update every second

            const mockGyroscope = setInterval(() => {
                setGyroscopeData({
                    x: parseFloat((Math.random() * 10 - 5).toFixed(2)),
                    y: parseFloat((Math.random() * 10 - 5).toFixed(2)),
                    z: parseFloat((Math.random() * 10 - 5).toFixed(2)),
                });
            }, 1000); // Update every second

            return () => {
                clearInterval(mockAccelerometer);
                clearInterval(mockGyroscope);
            };
        }

        // Check sensor availability on mount
        checkSensorsAvailability();

        // Automatically subscribe to sensors if available
        subscribeSensors();

        // Unsubscribe from sensors on unmount to prevent memory leaks
        return () => {
            unsubscribeSensors();
        };
    }, []);

    // Function to check if sensors are available
    const checkSensorsAvailability = async () => {
        try {
            const accelAvailable = await Accelerometer.isAvailableAsync();
            const gyroAvailable = await Gyroscope.isAvailableAsync();
            setAccelerometerAvailable(accelAvailable);
            setGyroscopeAvailable(gyroAvailable);

            if (!accelAvailable) {
                console.warn("Accelerometer is not available on this device.");
            }

            if (!gyroAvailable) {
                console.warn("Gyroscope is not available on this device.");
            }
        } catch (error) {
            console.error("Error checking sensor availability:", error);
            Alert.alert("Error", "Failed to check sensor availability.");
        }
    };

    // Debounced function to send sensor data
    const debouncedSendSensorData = useCallback(
        debounce(
            async (data: {
                accelerometer: SensorData;
                gyroscope: SensorData;
            }) => {
                try {
                    const response = await axios.post(FLASK_SERVER_URL, data);
                    const { fall_detected, predicted_activity } = response.data;

                    if (fall_detected) {
                        // Prevent multiple alerts by unsubscribing sensors temporarily
                        unsubscribeSensors();

                        Alert.alert(
                            "Fall Detected",
                            "Did you fall?",
                            [
                                {
                                    text: "No",
                                    onPress: () => {
                                        // Resume sensor subscriptions
                                        subscribeSensors();
                                    },
                                    style: "cancel",
                                },
                                {
                                    text: "Yes",
                                    onPress: () => {
                                        // Handle the fall event (e.g., send alert to emergency contacts)
                                        Alert.alert(
                                            "Alert",
                                            "Sending help to your location."
                                        );
                                        // Implement further actions as needed
                                        // Optionally, you can keep sensors unsubscribed
                                    },
                                },
                            ],
                            { cancelable: false }
                        );
                    } else {
                        console.log(
                            `Predicted Activity: ${predicted_activity}`
                        );
                    }
                } catch (error: any) {
                    console.error("Error sending sensor data:", error.message);
                    // Optionally, handle the error (e.g., retry logic)
                }
            },
            2000
        ), // 2 seconds debounce
        [] // Dependencies array
    );

    // Function to send sensor data to the backend
    const sendSensorData = async (data: {
        accelerometer: SensorData;
        gyroscope: SensorData;
    }) => {
        debouncedSendSensorData(data);
    };

    // Function to subscribe to both sensors
    const subscribeSensors = () => {
        if (!accelerometerAvailable && !gyroscopeAvailable) {
            return;
        }

        const updateInterval = 100; // in milliseconds

        if (accelerometerAvailable) {
            Accelerometer.setUpdateInterval(updateInterval);
            const accelSub: SensorSubscription = Accelerometer.addListener(
                (data: SensorData) => {
                    setAccelerometerData(data);
                    sendSensorData({
                        accelerometer: data,
                        gyroscope: gyroscopeData,
                    });
                }
            );
            setAccelerometerSubscription(accelSub);
        }

        if (gyroscopeAvailable) {
            Gyroscope.setUpdateInterval(updateInterval);
            const gyroSub: SensorSubscription = Gyroscope.addListener(
                (data: SensorData) => {
                    setGyroscopeData(data);
                    sendSensorData({
                        accelerometer: accelerometerData,
                        gyroscope: data,
                    });
                }
            );
            setGyroscopeSubscription(gyroSub);
        }
    };

    // Function to unsubscribe from both sensors
    const unsubscribeSensors = () => {
        accelerometerSubscription?.remove();
        gyroscopeSubscription?.remove();
        setAccelerometerSubscription(null);
        setGyroscopeSubscription(null);
    };

    // Function to subscribe to the accelerometer only
    const subscribeAccelerometer = () => {
        if (!accelerometerAvailable) {
            Alert.alert(
                "Unavailable",
                "Accelerometer is not available on this device."
            );
            return;
        }

        Accelerometer.setUpdateInterval(100);
        const accelSub: SensorSubscription = Accelerometer.addListener(
            (data: SensorData) => {
                setAccelerometerData(data);
                sendSensorData({
                    accelerometer: data,
                    gyroscope: gyroscopeData,
                });
            }
        );
        setAccelerometerSubscription(accelSub);
    };

    // Function to unsubscribe from the accelerometer only
    const unsubscribeAccelerometer = () => {
        accelerometerSubscription?.remove();
        setAccelerometerSubscription(null);
    };

    // Function to subscribe to the gyroscope only
    const subscribeGyroscope = () => {
        if (!gyroscopeAvailable) {
            Alert.alert(
                "Unavailable",
                "Gyroscope is not available on this device."
            );
            return;
        }

        Gyroscope.setUpdateInterval(100);
        const gyroSub: SensorSubscription = Gyroscope.addListener(
            (data: SensorData) => {
                setGyroscopeData(data);
                sendSensorData({
                    accelerometer: accelerometerData,
                    gyroscope: data,
                });
            }
        );
        setGyroscopeSubscription(gyroSub);
    };

    // Function to unsubscribe from the gyroscope only
    const unsubscribeGyroscope = () => {
        gyroscopeSubscription?.remove();
        setGyroscopeSubscription(null);
    };

    // Function to toggle the accelerometer subscription
    const toggleAccelerometer = () => {
        if (accelerometerSubscription) {
            unsubscribeAccelerometer();
        } else {
            subscribeAccelerometer();
        }
    };

    // Function to toggle the gyroscope subscription
    const toggleGyroscope = () => {
        if (gyroscopeSubscription) {
            unsubscribeGyroscope();
        } else {
            subscribeGyroscope();
        }
    };

    // Function to format sensor data for display
    const formatData = (data: SensorData): string => {
        return `x: ${data.x.toFixed(2)}\ny: ${data.y.toFixed(
            2
        )}\nz: ${data.z.toFixed(2)}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Sensor Data</Text>

            {accelerometerAvailable ? (
                <View style={styles.sensorContainer}>
                    <Text style={styles.sensorTitle}>Accelerometer</Text>
                    <Text style={styles.sensorData}>
                        {formatData(accelerometerData)}
                    </Text>
                    <Button
                        title={
                            accelerometerSubscription
                                ? "Stop Accelerometer"
                                : "Start Accelerometer"
                        }
                        onPress={toggleAccelerometer}
                    />
                </View>
            ) : (
                <Text style={styles.sensorUnavailable}>
                    Accelerometer not available on this device.
                </Text>
            )}

            {gyroscopeAvailable ? (
                <View style={styles.sensorContainer}>
                    <Text style={styles.sensorTitle}>Gyroscope</Text>
                    <Text style={styles.sensorData}>
                        {formatData(gyroscopeData)}
                    </Text>
                    <Button
                        title={
                            gyroscopeSubscription
                                ? "Stop Gyroscope"
                                : "Start Gyroscope"
                        }
                        onPress={toggleGyroscope}
                    />
                </View>
            ) : (
                <Text style={styles.sensorUnavailable}>
                    Gyroscope not available on this device.
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    header: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 20,
    },
    sensorContainer: {
        marginVertical: 10,
        padding: 15,
        backgroundColor: "#f2f2f2",
        borderRadius: 8,
    },
    sensorTitle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: "600",
    },
    sensorData: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 10,
    },
    sensorUnavailable: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginVertical: 10,
    },
});

export default SensorsComponent;
