import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { EventsBrowseScreen } from "../screens/EventsBrowseScreen";
import { EventDetailsScreen } from "../screens/EventDetailsScreen";

const Stack = createNativeStackNavigator();

export const EventsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="EventsBrowse"
    >
      <Stack.Screen name="EventsBrowse" component={EventsBrowseScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
    </Stack.Navigator>
  );
};
