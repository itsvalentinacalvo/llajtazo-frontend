import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExplorarScreen from "@/src/modules/home/screens/ExplorarScreen";

export type ExplorarStackParamList = {
  ExplorarScreen: undefined;
  // Add nested screens here as you develop
  // DetalleEventoScreen: { eventId: string };
  // ComentariosScreen: { eventId: string };
};

const Stack = createNativeStackNavigator<ExplorarStackParamList>();

export default function ExplorarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExplorarScreen" component={ExplorarScreen} />
    </Stack.Navigator>
  );
}
