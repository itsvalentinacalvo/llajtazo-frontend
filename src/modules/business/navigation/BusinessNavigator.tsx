import React, { useState, useCallback } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CoreTabBarBusiness } from "@/src/core/components/CoreTabBarBusiness";
import { CoreHeader } from "@/src/core/components/CoreHeader";
import { HomeHeaderProvider, useHomeHeader } from "@/src/core/components/HomeHeaderContext";

import InicioBusinessScreen from "@/src/modules/business/screens/InicioBusinessScreen";
import EventosStack from "@/src/modules/home/navigation/stacks/EventosStack";
import NuevoEventoScreen from "@/src/modules/business/screens/NuevoEventoScreen";
import PreviewEventScreen from "@/src/modules/business/screens/PreviewEventScreen";
import MetricasBusinessScreen from "@/src/modules/business/screens/MetricasBusinessScreen";
import MetricasTabScreen from "@/src/modules/business/screens/MetricasTabScreen";
import PerfilBusinessScreen from "@/src/modules/business/screens/PerfilBusinessScreen";

export type BusinessTabParamList = {
  InicioTab: undefined;
  EventosTab: undefined;
  NuevoTab: undefined;
  MetricasTab: undefined;
  PerfilTab: undefined;
};

const Tab = createBottomTabNavigator<BusinessTabParamList>();
const Stack = createNativeStackNavigator();

function BusinessTabNavigatorContent() {
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
        initialRouteName="InicioTab"
        tabBar={(props) => <CoreTabBarBusiness {...props} />}
        screenOptions={{
          headerShown: false,
          lazy: false,
        }}
      >
        <Tab.Screen
          name="InicioTab"
          component={InicioBusinessScreen}
          options={{ title: "Inicio" }}
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
          name="NuevoTab"
          component={NuevoEventoScreen}
          options={{ title: "Nuevo" }}
          listeners={{
            focus: () => toggleHeader(false),
          }}
        />

        <Tab.Screen
          name="MetricasTab"
          component={MetricasTabScreen}
          options={{ title: "Métricas" }}
          listeners={{
            focus: () => toggleHeader(true),
          }}
        />

        <Tab.Screen
          name="PerfilTab"
          component={PerfilBusinessScreen}
          options={{ title: "Perfil" }}
          listeners={{
            focus: () => toggleHeader(false),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

export type BusinessStackParamList = {
  BusinessTabs: undefined;
  PreviewEvent: { draftId?: string; eventId?: string };
  MetricasDetail: { eventId: string };
  EditEvento: { eventId: string };
};

export default function BusinessNavigator() {
  return (
    <HomeHeaderProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BusinessTabs" component={BusinessTabNavigatorContent} />
        <Stack.Screen name="PreviewEvent" component={PreviewEventScreen} />
        <Stack.Screen name="MetricasDetail" component={MetricasBusinessScreen} />
        <Stack.Screen name="EditEvento" component={NuevoEventoScreen} />
      </Stack.Navigator>
    </HomeHeaderProvider>
  );
}
