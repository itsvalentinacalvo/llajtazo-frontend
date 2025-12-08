import { useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, Switch, Dimensions } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, Easing } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/src/modules/auth/navigation/AuthNavigator";
import AuthInput from "@/src/modules/auth/components/AuthInput";
import PrimaryButton from "@/src/modules/auth/components/PrimaryButton";
import SocialButton from "@/src/modules/auth/components/SocialButton";
import Divider from "@/src/modules/auth/components/Divider";
import { ScreenKeyboardAwareScrollView } from "@/src/core/components/ScreenKeyboardAwareScrollView";
import { Colors, Spacing, Typography } from "@/src/core/constants/theme";
import { TEST_CREDENTIALS } from "@/src/core/test/profileData";
import { useStatusBarStyle } from "@/src/core/context/StatusBarContext";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginScreen({ onAuthSuccess }: { onAuthSuccess?: () => void }) {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get("window").height;
  const translateY = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [shakeFields, setShakeFields] = useState<{ [key: string]: boolean }>({});
  useStatusBarStyle("light", "#2BBBFF");

  const triggerShake = useCallback((fields: string[]) => {
    const shakeState: { [key: string]: boolean } = {};
    fields.forEach((field) => {
      shakeState[field] = true;
    });
    setShakeFields(shakeState);
    setTimeout(() => setShakeFields({}), 300);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const fieldsToShake: string[] = [];

    if (!email.trim()) {
      newErrors.email = "Este campo no puede estar vacío";
      fieldsToShake.push("email");
    }

    if (!password.trim()) {
      newErrors.password = "Este campo no puede estar vacío";
      fieldsToShake.push("password");
    }

    if (!newErrors.email && !newErrors.password) {
      const emailMatches = email.toLowerCase() === TEST_CREDENTIALS.email.toLowerCase();
      const passwordMatches = password === TEST_CREDENTIALS.password;

      if (!emailMatches || !passwordMatches) {
        newErrors.general = "Correo o contraseña incorrectos";
        fieldsToShake.push("email", "password");
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      console.log("[Login] Validation failed:", newErrors);
    }
    if (fieldsToShake.length > 0) {
      triggerShake(fieldsToShake);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    console.log("[Login] Pressed. email=", email, "rememberMe=", rememberMe);
    if (validateForm()) {
      console.log("[Login] Validation passed");
      // animate swipe down programmatically then navigate
      const finalize = () => {
        if (onAuthSuccess) {
          console.log("[Login] animation complete -> calling onAuthSuccess");
          onAuthSuccess();

          // Also attempt to reset the parent navigator to Home to ensure flow switches
          try {
            const parent = (navigation as any).getParent && (navigation as any).getParent();
            parent && parent.reset && parent.reset({ index: 0, routes: [{ name: "Home" }] });
          } catch (e) {
            console.warn("[Login] failed to reset parent to Home:", e);
          }
        } else {
          console.log("[Login] animation complete -> dispatching reset to MainApp->ExplorarTab");
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "MainApp", params: { screen: "ExplorarTab" } }],
            })
          );
        }
      };

      console.debug("[Login] starting swipe-down animation");
      translateY.value = withTiming(windowHeight, { duration: 450, easing: Easing.out(Easing.cubic) }, (finished) => {
        if (finished) runOnJS(finalize)();
      });
    } else {
      console.log("[Login] Not navigating because validation failed");
    }
  };

  const handleGoogleLogin = () => {
    console.log("[Login] Google login pressed");
  };

  const handleFacebookLogin = () => {
    console.log("[Login] Facebook login pressed");
  };

  const handleForgotPassword = () => {
    console.log("[Login] Forgot password pressed -> navigating to ResetPassword");
    navigation.navigate("ResetPassword");
  };

  const handleNavigateToRegister = () => {
    console.log("[Login] Navigate to Register pressed (replace)");
    // replace so user cannot go back with swipe/hardware back
    navigation.replace("Register");
  };

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const hasGeneralError = !!errors.general;

  return (
    <LinearGradient
      colors={["#2BBBFF", "#0099E6"]}
      style={styles.gradient}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
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
              onChangeText={(text) => {
                setEmail(text);
                clearError("email");
              }}
              keyboardType="email-address"
              error={errors.email || (hasGeneralError && !errors.email ? " " : undefined)}
              shake={shakeFields.email}
            />
            <AuthInput
              icon="lock"
              placeholder="Contraseña"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                clearError("password");
              }}
              secureTextEntry
              error={errors.password || (hasGeneralError && !errors.password ? " " : undefined)}
              shake={shakeFields.password}
            />

            {hasGeneralError ? (
              <Text style={styles.generalError}>{errors.general}</Text>
            ) : null}

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
      </Animated.View>
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
  generalError: {
    color: "#FF5757",
    fontSize: 12,
    alignSelf: "flex-start",
    marginTop: -8,
    marginBottom: 8,
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
