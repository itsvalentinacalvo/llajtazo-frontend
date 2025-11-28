import { NavigationContainer } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";

// Estos imports serán reemplazados por los módulos reales cuando existan
let AuthStackNavigator: any = null;
let MainStackNavigator: any = null;

try {
  AuthStackNavigator =
    require("@/src/modules/auth/navigation/AuthStackNavigator").default;
} catch (e) {
  AuthStackNavigator = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>AuthStackNavigator no disponible</Text>
    </View>
  );
}

try {
  MainStackNavigator =
    require("@/src/modules/home/navigation/MainStackNavigator").default;
} catch (e) {
  MainStackNavigator = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>MainStackNavigator no disponible</Text>
    </View>
  );
}

export default function RootNavigator() {
  // TODO: cambiar cuando implementen login real
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulación de splash/load al iniciar la app
  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}
