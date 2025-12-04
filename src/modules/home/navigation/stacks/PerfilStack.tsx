import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PerfilScreen from "@/src/modules/home/screens/PerfilScreen";

export type PerfilStackParamList = {
  PerfilScreen: undefined;
  // Add nested screens here as you develop
  // EditarPerfilScreen: undefined;
  // AjustesScreen: undefined;
};

const Stack = createNativeStackNavigator<PerfilStackParamList>();

export default function PerfilStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PerfilScreen" component={PerfilScreen} />
    </Stack.Navigator>
  );
}
