import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../views/screens/HomeScreen";
import DetailsScreen from "../views/screens/DetailsScreen";
import { useColorScheme } from "react-native";

export type RootStackParamList = {
    Home: undefined;
    Details: { city?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const colorScheme = useColorScheme();
    return (
        <NavigationContainer theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Weather" }} />
                <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Details" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
