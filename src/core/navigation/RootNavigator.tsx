import { NavigationContainer } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";

// Placeholders (named) used while modules are not implemented
function AuthStackPlaceholder() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>AuthStackNavigator no disponible</Text>
    </View>
  );
}

function MainStackPlaceholder() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>MainStackNavigator no disponible</Text>
    </View>
  );
}

// Estos imports serán reemplazados por los módulos reales cuando existan
let AuthStackNavigator: any = AuthStackPlaceholder;
let MainStackNavigator: any = MainStackPlaceholder;

try {
  // Module may not exist yet; prefer dynamic require but silence that rule locally
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const authMod = require("@/src/modules/auth/navigation/AuthStackNavigator");
  AuthStackNavigator = authMod?.default ?? authMod;
} catch {
  // keep placeholder
}

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mainMod = require("@/src/modules/home/navigation/MainStackNavigator");
  MainStackNavigator = mainMod?.default ?? mainMod;
} catch {
  // keep placeholder
}

export default function RootNavigator() {
  // TODO: cambiar cuando implementen login real
  const [isAuthenticated] = useState(false);
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
