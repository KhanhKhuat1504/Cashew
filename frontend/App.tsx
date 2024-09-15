import React from "react";
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";
import SensorsComponent from "./components/SensorComponent";

const App: React.FC = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <SensorsComponent />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
});

export default App;
