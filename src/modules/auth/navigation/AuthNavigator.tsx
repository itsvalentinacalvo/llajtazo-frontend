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
  Verification: { email: string };
  Interests: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList, "AuthStack">();

export default function AuthStackNavigator({
  onAuthSuccess,
  initialRouteName = "Register",
}: {
  onAuthSuccess?: () => void;
  initialRouteName?: "Login" | "Register" | "ResetPassword" | "Verification" | "Interests";
}) {
  return (
    <Stack.Navigator
      id="AuthStack"
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Login"
        options={{ gestureEnabled: false }}
      >
        {(props) => <LoginScreen {...props} onAuthSuccess={onAuthSuccess} />}
      </Stack.Screen>
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="Interests">
        {(props) => <InterestsScreen {...props} onAuthSuccess={onAuthSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
