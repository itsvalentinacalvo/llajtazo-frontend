import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";
import ErrorBoundary from "@/src/core/components/ErrorBoundary";
import RootNavigator from "@/src/core/navigation/RootNavigator";
import { navigationRef } from "@/src/core/navigation/navigationRef";
import { ProfileProvider } from "@/src/core/context/ProfileContext";
import { useTheme } from "@/src/core/hooks/useTheme";
import { StatusBarProvider } from "@/src/core/context/StatusBarContext";
import { BusinessProvider } from "@/src/modules/business/context/BusinessContext";

export default function App() {
  enableScreens();
  const { theme } = useTheme();
  return (
    <ErrorBoundary>
      <BusinessProvider>
        <ProfileProvider>
          <SafeAreaProvider>
            <GestureHandlerRootView style={[styles.root, { backgroundColor: theme.backgroundRoot }]}>
              <KeyboardProvider>
                <StatusBarProvider>
                  <NavigationContainer ref={navigationRef}>
                    <RootNavigator />
                  </NavigationContainer>
                </StatusBarProvider>
              </KeyboardProvider>
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </ProfileProvider>
      </BusinessProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
