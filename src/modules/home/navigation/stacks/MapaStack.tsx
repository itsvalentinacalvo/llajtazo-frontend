import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapaScreen from "@/src/modules/home/screens/MapaScreen";

export type MapaStackParamList = {
  MapaScreen: undefined;
};

const Stack = createNativeStackNavigator<MapaStackParamList>();

export default function MapaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapaScreen" component={MapaScreen} />
    </Stack.Navigator>
  );
}
