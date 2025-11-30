import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AuthStackNavigator from "@/src/modules/auth/navigation/AuthStackNavigator";

function MainStackPlaceholder() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>MainStackNavigator no disponible</Text>
    </View>
  );
}

// Estos imports serán reemplazados por los módulos reales cuando existan
// `AuthStackNavigator` se importa estáticamente porque ya está implementado
let MainStackNavigator: any = MainStackPlaceholder;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mainMod = require("@/src/modules/home/navigation/MainTabNavigator");
  MainStackNavigator = mainMod?.default ?? mainMod;
} catch {
  // keep placeholder
}

export default function RootNavigator() {
  // TODO: cambiar cuando implementen login real
  const isAuthenticated = true; // por ahora siempre falso
  const [isLoading, setIsLoading] = useState(true);

  // Simulación de splash/load al iniciar la app
  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  return isAuthenticated ? <MainStackNavigator /> : <AuthStackNavigator />;
}
