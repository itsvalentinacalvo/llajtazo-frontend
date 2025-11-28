import { createNativeStackNavigator } from "@react-navigation/native-stack";

import InterestsScreen from "@/src/modules/auth/screens/InterestsScreen";
import LoginScreen from "@/src/modules/auth/screens/LoginScreen";
import RegisterScreen from "@/src/modules/auth/screens/RegisterScreen";
import ResetPasswordScreen from "@/src/modules/auth/screens/ResetPasswordScreen";
import VerificationScreen from "@/src/modules/auth/screens/VerificationScreen";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
  Verification: undefined;
  Interests: undefined;
  MainApp: {
    screen: string;
    params?: Record<string, unknown>;
  };
};

const Stack = createNativeStackNavigator<AuthStackParamList, "AuthStack">();

export default function AuthStackNavigator() {
  return (
    <Stack.Navigator
      id="AuthStack"
      initialRouteName="Register"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="Interests" component={InterestsScreen} />
    </Stack.Navigator>
  );
}
