import React, { useState } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CoreTabBar } from "@/src/core/components/CoreTabBar";
import { CoreHeader } from "@/src/core/components/CoreHeader";
import { HomeHeaderProvider, useHomeHeader } from "@/src/core/components/HomeHeaderContext";
import ExplorarStack from "@/src/modules/home/navigation/stacks/ExplorarStack";
import EventosStack from "@/src/modules/home/navigation/stacks/EventosStack";
import MapaStack from "@/src/modules/home/navigation/stacks/MapaStack";
import PerfilStack from "@/src/modules/home/navigation/stacks/PerfilStack";

// Tab Navigator Types
export type HomeTabParamList = {
  ExplorarTab: undefined;
  EventosTab: undefined;
  MapaTab: undefined;
  PerfilTab: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();

// Tab Navigator Content
function HomeTabNavigatorContent() {
  const { selectedCategory, setSelectedCategory, setHeaderHeight } = useHomeHeader();
  const [showHeader, setShowHeader] = useState(true);

  return (
    <React.Fragment>
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
          listeners={() => ({
            focus: () => setShowHeader(true),
          })}
        />
        <Tab.Screen
          name="EventosTab"
          component={EventosStack}
          options={{ title: "Eventos" }}
          listeners={() => ({
            focus: () => setShowHeader(true),
          })}
        />
        <Tab.Screen
          name="MapaTab"
          component={MapaStack}
          options={{ title: "Mapa", unmountOnBlur: true } as any}
          listeners={() => ({
            focus: () => setShowHeader(true),
          })}
        />
        <Tab.Screen
          name="PerfilTab"
          component={PerfilStack}
          options={{ title: "Perfil" }}
          listeners={() => ({
            focus: () => {
              setShowHeader(false);
              setHeaderHeight(0);
            },
          })}
        />
      </Tab.Navigator>
    </React.Fragment>
  );
}

// Main export - HomeNavigator is the Tab Navigator with Stacks inside
export default function HomeNavigator() {
  console.debug("[Home][HomeNavigator] render");

  return (
    <HomeHeaderProvider>
      <View style={{ flex: 1 }}>
        <HomeTabNavigatorContent />
      </View>
    </HomeHeaderProvider>
  );
}
