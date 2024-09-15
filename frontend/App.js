import React from "react";
import SafeView from "./screens/SafeView";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import { SafeAreaView, StyleSheet, Text } from "react-native";
import AppNavigation from "./screens/AppNavigation";

const App = () => {
   

    return (
    <SafeAreaView style={styles.safeArea}>
        <AppNavigation/>
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
