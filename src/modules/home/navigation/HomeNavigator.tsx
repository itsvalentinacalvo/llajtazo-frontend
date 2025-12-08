import React, { useState, useCallback } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CoreTabBar } from "@/src/core/components/CoreTabBar";
import { CoreHeader } from "@/src/core/components/CoreHeader";
import { HomeHeaderProvider, useHomeHeader } from "@/src/core/components/HomeHeaderContext";

import ExplorarStack from "@/src/modules/home/navigation/stacks/ExplorarStack";
import EventosStack from "@/src/modules/home/navigation/stacks/EventosStack";
import MapaStack from "@/src/modules/home/navigation/stacks/MapaStack";
import PerfilStack from "@/src/modules/home/navigation/stacks/PerfilStack";

import MenuNavigator from "@/src/modules/menu/navigation/MenuNavigator";
import SavedEventsScreen from "@/src/modules/menu/screens/SavedEventsScreen";

// Tab Navigator Types
export type HomeTabParamList = {
  ExplorarTab: undefined;
  EventosTab: undefined;
  MapaTab: undefined;
  PerfilTab: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();
const Stack = createNativeStackNavigator(); // ← AGREGADO

function HomeTabNavigatorContent() {
  const { selectedCategory, setSelectedCategory, setHeaderHeight } = useHomeHeader();
  const [showHeader, setShowHeader] = useState(true);
  const toggleHeader = useCallback(
    (visible: boolean) => {
      setShowHeader(visible);
      if (!visible) {
        setHeaderHeight(0);
      }
    },
    [setHeaderHeight]
  );

  return (
    <>
      {showHeader && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }} pointerEvents="box-none">
          <CoreHeader
            selectedCategory={selectedCategory}
            onCategoryPress={(cat) => setSelectedCategory(cat)}
            onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
            onSearchChange={(text) => console.log("Search:", text)}
            onFilterPress={() => console.log("Filter pressed")}
          />
        </View>
      )}

      <Tab.Navigator
        initialRouteName="ExplorarTab"
        tabBar={(props) => <CoreTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          lazy: false,
        }}
      >
        <Tab.Screen
          name="ExplorarTab"
          component={ExplorarStack}
          options={{ title: "Explorar" }}
          listeners={{
            focus: () => toggleHeader(true),
          }}
        />

        <Tab.Screen
          name="EventosTab"
          component={EventosStack}
          options={{ title: "Eventos" }}
          listeners={{
            focus: () => toggleHeader(true),
          }}
        />

        <Tab.Screen
          name="MapaTab"
          component={MapaStack}
          options={{ title: "Mapa", unmountOnBlur: true } as any}
          listeners={{
            focus: () => toggleHeader(true),
          }}
        />

        <Tab.Screen
          name="PerfilTab"
          component={PerfilStack}
          options={{ title: "Perfil" }}
          listeners={{
            focus: () => toggleHeader(false),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

export default function HomeNavigator() {
  return (
    <HomeHeaderProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {/* Tus TABS principales */}
        <Stack.Screen name="HomeTabs" component={HomeTabNavigatorContent} />

        {/* Aquí viven las pantallas del BurgerMenu */}
        <Stack.Screen name="Tickets" component={MenuNavigator} />
        {/* Pantalla de Guardados accesible desde el Burger Menu */}
        <Stack.Screen name="Saved" component={SavedEventsScreen} />
        
      </Stack.Navigator>
    </HomeHeaderProvider>
  );
}