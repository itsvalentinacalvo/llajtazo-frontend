import { useState } from "react";
import { View, Text, StyleSheet, Pressable, Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/src/modules/auth/navigation/AuthStackNavigator";
import AuthInput from "@/src/modules/auth/components/AuthInput";
import PrimaryButton from "@/src/modules/auth/components/PrimaryButton";
import SocialButton from "@/src/modules/auth/components/SocialButton";
import Divider from "@/src/modules/auth/components/Divider";
import { ScreenKeyboardAwareScrollView } from "@/src/core/components/ScreenKeyboardAwareScrollView";
import { Colors, Spacing, Typography } from "@/src/core/constants/theme";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    console.log("Log in pressed");
  };

  const handleGoogleLogin = () => {
    console.log("Google login pressed");
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login pressed");
  };

  const handleForgotPassword = () => {
    navigation.navigate("ResetPassword");
  };

  const handleNavigateToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <LinearGradient
      colors={["#2BBBFF", "#0099E6"]}
      style={styles.gradient}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <ScreenKeyboardAwareScrollView
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: insets.top + Spacing["4xl"],
            paddingBottom: insets.bottom + Spacing["2xl"],
          },
        ]}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>¿Aún no tienes una Cuenta? </Text>
            <Pressable onPress={handleNavigateToRegister}>
              <Text style={styles.link}>Regístrate</Text>
            </Pressable>
          </View>

          <View style={styles.inputsContainer}>
            <AuthInput
              icon="mail"
              placeholder="abc@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <AuthInput
              icon="lock"
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={styles.rememberContainer}>
              <View style={styles.switchContainer}>
                <Switch
                  value={rememberMe}
                  onValueChange={setRememberMe}
                  trackColor={{ false: "#767577", true: "#2BBBFF" }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#767577"
                  style={styles.switch}
                />
                <Text style={styles.rememberText}>Recuérdame</Text>
              </View>
              <Pressable onPress={handleForgotPassword}>
                <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
              </Pressable>
            </View>

            <PrimaryButton
              title="INICIAR SESIÓN"
              onPress={handleLogin}
            />

            <Divider />

            <SocialButton
              title="Continuar con Google"
              onPress={handleGoogleLogin}
              type="google"
            />
            <SocialButton
              title="Continuar con Facebook"
              onPress={handleFacebookLogin}
              type="facebook"
            />
          </View>
        </View>
      </ScreenKeyboardAwareScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing["2xl"],
  },
  formContainer: {
    width: "100%",
  },
  title: {
    ...Typography.h1,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  link: {
    fontSize: 14,
    color: Colors.light.primary,
    textDecorationLine: "underline",
  },
  inputsContainer: {
    marginTop: Spacing.lg,
    alignItems: "center",
  },
  rememberContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  rememberText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  forgotPassword: {
    fontSize: 12,
    color: Colors.light.text,
    textDecorationLine: "underline",
  },
});
