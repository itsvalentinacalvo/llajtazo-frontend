import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "@/src/modules/auth/screens/LoginScreen";
import RegisterBusinessScreen from "@/src/modules/business/screens/RegisterBusinessScreen";
import ResetPasswordBusinessScreen from "@/src/modules/business/screens/ResetPasswordBusinessScreen";
import VerificationBusinessScreen from "@/src/modules/business/screens/VerificationBusinessScreen";

export type BusinessAuthStackParamList = {
  LoginBusiness: undefined;
  RegisterBusiness: undefined;
  ResetPasswordBusiness: undefined;
  VerificationBusiness: { email: string; flow: "register" | "reset" };
};

const Stack = createNativeStackNavigator<BusinessAuthStackParamList, "BusinessAuthStack">();

export default function BusinessAuthNavigator({
  onAuthSuccess,
  initialRouteName = "RegisterBusiness",
}: {
  onAuthSuccess?: () => void;
  initialRouteName?: "LoginBusiness" | "RegisterBusiness";
}) {
  return (
    <Stack.Navigator
      id="BusinessAuthStack"
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="LoginBusiness"
        options={{ gestureEnabled: false }}
      >
        {(props) => <LoginScreen {...props} onAuthSuccess={onAuthSuccess} />}
      </Stack.Screen>
      <Stack.Screen
        name="RegisterBusiness"
        options={{ gestureEnabled: false }}
      >
        {(props) => <RegisterBusinessScreen {...props} onAuthSuccess={onAuthSuccess} />}
      </Stack.Screen>
      <Stack.Screen
        name="ResetPasswordBusiness"
        component={ResetPasswordBusinessScreen}
      />
      <Stack.Screen name="VerificationBusiness">
        {(props) => <VerificationBusinessScreen {...props} onAuthSuccess={onAuthSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
