import { useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BusinessAuthStackParamList } from "@/src/modules/business/navigation/BusinessAuthNavigator";
import AuthInput from "@/src/modules/auth/components/AuthInput";
import PrimaryButton from "@/src/modules/auth/components/PrimaryButton";
import SocialButton from "@/src/modules/auth/components/SocialButton";
import Divider from "@/src/modules/auth/components/Divider";
import { ScreenKeyboardAwareScrollView } from "@/src/core/components/ScreenKeyboardAwareScrollView";
import { Colors, Spacing, Typography } from "@/src/core/constants/theme";
import { BUSINESS_TEST_CREDENTIALS } from "@/src/modules/business/test/businessData";
import { useStatusBarStyle } from "@/src/core/context/StatusBarContext";
import { useBusiness } from "@/src/modules/business/context/BusinessContext";
import { TEST_DATABASE } from "@/src/core/test/testDatabase";

type RegisterBusinessScreenNavigationProp = NativeStackNavigationProp<
  BusinessAuthStackParamList,
  "RegisterBusiness"
>;

interface FormErrors {
  organizationName?: string;
  email?: string;
  username?: string;
  password?: string;
}

export default function RegisterBusinessScreen({ onAuthSuccess }: { onAuthSuccess?: () => void }) {
  const navigation = useNavigation<RegisterBusinessScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { loginBusiness } = useBusiness();
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
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

    if (!organizationName.trim()) {
      newErrors.organizationName = "Este campo no puede estar vacío";
      fieldsToShake.push("organizationName");
    }

    if (!email.trim()) {
      newErrors.email = "Este campo no puede estar vacío";
      fieldsToShake.push("email");
    } else if (email.toLowerCase() === BUSINESS_TEST_CREDENTIALS.email.toLowerCase()) {
      newErrors.email = "Ese correo ya se encuentra registrado";
      fieldsToShake.push("email");
    }

    if (!username.trim()) {
      newErrors.username = "Este campo no puede estar vacío";
      fieldsToShake.push("username");
    } else if (username.toLowerCase() === BUSINESS_TEST_CREDENTIALS.username.toLowerCase()) {
      newErrors.username = "Ese nombre de usuario ya está en uso";
      fieldsToShake.push("username");
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
      console.log("[RegisterBusiness] Validation passed -> logging in business user");
      // Use first test organizer id as placeholder for registration flow
      loginBusiness(TEST_DATABASE.organizadores[0]?.id ?? 0);
      if (onAuthSuccess) {
        onAuthSuccess();
      }
    }
  };

  const handleGoogleRegister = () => {
    console.log("[RegisterBusiness] Google register pressed");
  };

  const handleFacebookRegister = () => {
    console.log("[RegisterBusiness] Facebook register pressed");
  };

  const handleNavigateToLogin = () => {
    console.log("[RegisterBusiness] Navigate to Login pressed (replace)");
    navigation.replace("LoginBusiness");
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
          <Text style={styles.title}>Regístrate como Organizador</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Ya tienes una cuenta? </Text>
            <Pressable onPress={handleNavigateToLogin}>
              <Text style={styles.link}>Inicia Sesión</Text>
            </Pressable>
          </View>

          <View style={styles.inputsContainer}>
            <AuthInput
              icon="briefcase"
              placeholder="Nombre de la Organización"
              value={organizationName}
              onChangeText={(text) => {
                setOrganizationName(text);
                clearError("organizationName");
              }}
              error={errors.organizationName}
              shake={shakeFields.organizationName}
            />
            <AuthInput
              icon="mail"
              placeholder="Correo Corporativo"
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
              icon="user"
              placeholder="Usuario"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                clearError("username");
              }}
              error={errors.username}
              shake={shakeFields.username}
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
    marginBottom: Spacing.lg,
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
