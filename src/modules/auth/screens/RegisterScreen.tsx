import { useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
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

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
}

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const validatePassword = (pwd: string): string | undefined => {
    if (!pwd.trim()) {
      return "Este campo no puede estar vacío";
    }
    if (pwd.length < 8) {
      return "Debe tener un mínimo de 8 caracteres";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const fieldsToShake: string[] = [];

    if (!fullName.trim()) {
      newErrors.fullName = "Este campo no puede estar vacío";
      fieldsToShake.push("fullName");
    }

    if (!email.trim()) {
      newErrors.email = "Este campo no puede estar vacío";
      fieldsToShake.push("email");
    } else if (email.toLowerCase() === TEST_CREDENTIALS.email.toLowerCase()) {
      newErrors.email = "Ese correo ya se encuentra registrado";
      fieldsToShake.push("email");
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
      fieldsToShake.push("password");
    }

    setErrors(newErrors);
    if (fieldsToShake.length > 0) {
      triggerShake(fieldsToShake);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (validateForm()) {
      console.log("[Register] Validation passed -> navigating to Verification with email=", email);
      navigation.navigate("Verification", { email });
    }
  };

  const handleGoogleRegister = () => {
    console.log("[Register] Google register pressed");
  };

  const handleFacebookRegister = () => {
    console.log("[Register] Facebook register pressed");
  };

  const handleNavigateToLogin = () => {
    console.log("[Register] Navigate to Login pressed (replace)");
    // replace so user cannot go back with swipe/hardware back
    navigation.replace("Login");
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
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
          <Text style={styles.title}>Hola, Bienvenido! 👋</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Ya tienes una cuenta? </Text>
            <Pressable onPress={handleNavigateToLogin}>
              <Text style={styles.link}>Inicia Sesión</Text>
            </Pressable>
          </View>

          <View style={styles.inputsContainer}>
            <AuthInput
              icon="user"
              placeholder="Nombre Completo"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                clearError("fullName");
              }}
              error={errors.fullName}
              shake={shakeFields.fullName}
            />
            <AuthInput
              icon="mail"
              placeholder="abc@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                clearError("email");
              }}
              keyboardType="email-address"
              error={errors.email}
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
              error={errors.password}
              shake={shakeFields.password}
            />

            <PrimaryButton
              title="REGÍSTRATE"
              onPress={handleRegister}
            />

            <Divider />

            <SocialButton
              title="Registrarte con Google"
              onPress={handleGoogleRegister}
              type="google"
            />
            <SocialButton
              title="Registrarte con Facebook"
              onPress={handleFacebookRegister}
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
});
