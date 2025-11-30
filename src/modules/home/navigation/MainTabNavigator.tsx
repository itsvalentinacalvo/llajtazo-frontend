import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ExplorarScreen from "@/src/modules/home/screens/ExplorarScreen";
import EventosScreen from "@/src/modules/home/screens/EventosScreen";
import MapaScreen from "@/src/modules/home/screens/MapaScreen";
import PerfilScreen from "@/src/modules/home/screens/PerfilScreen";
import { CoreTabBar } from "@/src/core/components/CoreTabBar";

export type MainTabParamList = {
  ExplorarTab: undefined;
  EventosTab: undefined;
  MapaTab: undefined;
  PerfilTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="ExplorarTab"
      tabBar={(props) => <CoreTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="ExplorarTab"
        component={ExplorarScreen}
        options={{ title: "Explorar" }}
      />
      <Tab.Screen
        name="EventosTab"
        component={EventosScreen}
        options={{ title: "Eventos" }}
      />
      <Tab.Screen
        name="MapaTab"
        component={MapaScreen}
        options={{ title: "Mapa" }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={PerfilScreen}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}
