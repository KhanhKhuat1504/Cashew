import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserChoice from "./UserChoice";
import UserForm from "./UserForm";
import SafeView from "./SafeView";
import UserFormPati from "./UserForm-pati";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserChoice">
        <Stack.Screen
          name="UserForm"
          options={{ headerShown: false }}
          component={UserForm}
        />
        <Stack.Screen
          name="UserChoice"
          options={{ headerShown: false }}
          component={UserChoice}
        />
        <Stack.Screen name="UserFormPati" component={UserFormPati} />
        <Stack.Screen name="SafeView" component={SafeView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}