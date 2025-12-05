import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EventosScreen from "@/src/modules/home/screens/EventosScreen";

export type EventosStackParamList = {
  EventosScreen: undefined;
  // Add nested screens here as you develop
  // DetalleEventoScreen: { eventId: string };
  // ComentariosScreen: { eventId: string };
};

const Stack = createNativeStackNavigator<EventosStackParamList>();

export default function EventosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventosScreen" component={EventosScreen} />
    </Stack.Navigator>
  );
}
