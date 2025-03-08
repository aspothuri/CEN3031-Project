import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LogIn from "../pages/LogIn";
import SignUp from "../pages/SignUp";

const Stack = createStackNavigator();

export default function HomeScreen() {
  return (
    <Stack.Navigator initialRouteName="LogIn">
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}
