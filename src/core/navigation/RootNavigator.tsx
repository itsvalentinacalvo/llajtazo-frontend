import { useState, useCallback } from "react";
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStackNavigator from "@/src/modules/auth/navigation/AuthNavigator";
import HomeNavigator from "@/src/modules/home/navigation/HomeNavigator";
import NotificationsScreen from "@/src/core/screens/NotificationsScreen";
import BurgerMenuScreen from "@/src/core/screens/BurgerMenuScreen";
import BusinessBurgerMenuScreen from "@/src/modules/business/screens/BusinessBurgerMenuScreen";
import EventDetailScreen from "@/src/modules/events/screens/EventDetailScreen";
import BusinessFlowNavigator from "@/src/modules/business/navigation/BusinessFlowNavigator";
import { SplashScreen, AppBootstrapProvider } from "@/src/modules/splash-screen";
import { navigationRef } from "@/src/core/navigation/navigationRef";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authStartRoute, setAuthStartRoute] = useState<"Login" | "Register">("Register");
  const [isSplashComplete, setIsSplashComplete] = useState(false);
  const rootScale = useSharedValue(1);
  const rootTranslateY = useSharedValue(0);

  const rootAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: rootScale.value },
      { translateY: rootTranslateY.value },
    ],
  }));

  const handleSplashComplete = useCallback(() => {
    setIsSplashComplete(true);
  }, []);

  const handleAuthLogout = () => {
    console.log("[RootNavigator] handleAuthLogout called -> logging out");
    try {
      setIsAuthenticated(false);
      setAuthStartRoute("Login");
      console.debug("[RootNavigator] set isAuthenticated=false and authStartRoute=Login");

      if (navigationRef.isReady()) {
        console.debug("[RootNavigator] navigationRef is ready -> resetting stack to Auth → Login");
        navigationRef.reset({
          index: 0,
          routes: [
            {
              name: "Auth",
              state: {
                index: 0,
                routes: [{ name: "Login" as const }],
              },
            },
          ],
        });
      } else {
        console.debug("[RootNavigator] navigationRef not ready; relying on state flip only");
      }
    } catch (e) {
      console.error("[RootNavigator] error during handleAuthLogout:", e);
    }
  };

  if (!isSplashComplete) {
    return <SplashScreen onReady={handleSplashComplete} />;
  }

  const initial = isAuthenticated ? "Home" : "Auth";

  return (
    <AppBootstrapProvider>
      <Animated.View style={[{ flex: 1 }, rootAnimatedStyle]}>
        <Stack.Navigator
          key={isAuthenticated ? "auth-true" : "auth-false"}
          id="RootStack"
          initialRouteName={initial}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Auth">
            {(props) => <AuthStackNavigator {...props} onAuthSuccess={() => setIsAuthenticated(true)} initialRouteName={authStartRoute} />}
          </Stack.Screen>

          <Stack.Screen name="Home" component={HomeNavigator} />

          <Stack.Screen
            name="BurgerMenu"
            options={{
              headerShown: false,
              presentation: "transparentModal",
              animation: "fade",
              gestureEnabled: false,
            }}
          >
            {(props) => <BurgerMenuScreen {...props} onAuthLogOut={handleAuthLogout} />}
          </Stack.Screen>

          <Stack.Screen
            name="BusinessBurgerMenu"
            options={{
              headerShown: false,
              presentation: "transparentModal",
              animation: "fade",
              gestureEnabled: false,
            }}
          >
            {(props) => <BusinessBurgerMenuScreen {...props} onAuthLogOut={handleAuthLogout} />}
          </Stack.Screen>

          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{
              headerShown: false,
              gestureEnabled: true,
              gestureDirection: "horizontal",
              animation: "slide_from_right",
              presentation: "card",
            }}
          />

          <Stack.Screen
            name="EventDetail"
            component={EventDetailScreen}
            options={{
              headerShown: false,
              presentation: "card",
              animation: "slide_from_right",
              gestureEnabled: true,
              gestureDirection: "horizontal",
            }}
          />

          <Stack.Screen
            name="Business"
            options={{ headerShown: false, gestureEnabled: false }}
            component={BusinessFlowNavigator}
          />
        </Stack.Navigator>
      </Animated.View>
    </AppBootstrapProvider>
  );
}
