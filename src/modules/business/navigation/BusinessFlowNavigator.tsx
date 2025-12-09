import React, { useCallback, useEffect } from "react";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRoute, RouteProp } from "@react-navigation/native";
import BusinessAuthNavigator from "@/src/modules/business/navigation/BusinessAuthNavigator";
import BusinessNavigator from "@/src/modules/business/navigation/BusinessNavigator";
import BusinessSplashScreen from "@/src/modules/business/screens/BusinessSplashScreen";
import { useBusiness } from "@/src/modules/business/context/BusinessContext";
import { RootStackParamList } from "@/src/core/navigation/navigationRef";

export type BusinessFlowStackParamList = {
  BusinessLanding: undefined;
  BusinessAuthStack: { initialRouteName?: "LoginBusiness" | "RegisterBusiness" } | undefined;
  BusinessApp: undefined;
};

const Stack = createNativeStackNavigator<BusinessFlowStackParamList>();

type BusinessLandingProps = NativeStackScreenProps<BusinessFlowStackParamList, "BusinessLanding"> & {
  initialAuthRoute: "LoginBusiness" | "RegisterBusiness";
};

function BusinessLandingScreenWrapper({ navigation, initialAuthRoute }: BusinessLandingProps) {
  const { isBusinessAuthenticated } = useBusiness();

  useEffect(() => {
    if (isBusinessAuthenticated) {
      navigation.reset({ index: 0, routes: [{ name: "BusinessApp" }] });
    }
  }, [isBusinessAuthenticated, navigation]);

  const handleComplete = useCallback(() => {
    if (isBusinessAuthenticated) {
      navigation.reset({ index: 0, routes: [{ name: "BusinessApp" }] });
      return;
    }

    navigation.replace("BusinessAuthStack", {
      initialRouteName: initialAuthRoute,
    });
  }, [initialAuthRoute, isBusinessAuthenticated, navigation]);

  return <BusinessSplashScreen onComplete={handleComplete} />;
}

export default function BusinessFlowNavigator() {
  const route = useRoute<RouteProp<RootStackParamList, "Business">>();
  const initialAuthRoute = route.params?.initialAuthRoute ?? "RegisterBusiness";

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BusinessLanding">
        {(props) => (
          <BusinessLandingScreenWrapper
            {...props}
            initialAuthRoute={initialAuthRoute}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="BusinessAuthStack">
        {(props) => (
          <BusinessAuthNavigator
            {...props}
            initialRouteName={props.route.params?.initialRouteName ?? "RegisterBusiness"}
            onAuthSuccess={() => {
              props.navigation.reset({ index: 0, routes: [{ name: "BusinessApp" }] });
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="BusinessApp" component={BusinessNavigator} />
    </Stack.Navigator>
  );
}
