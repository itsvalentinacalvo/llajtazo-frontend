import { useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/src/modules/auth/navigation/AuthNavigator";
import { Feather } from "@expo/vector-icons";
import AuthInput from "@/src/modules/auth/components/AuthInput";
import PrimaryButton from "@/src/modules/auth/components/PrimaryButton";
import { ScreenKeyboardAwareScrollView } from "@/src/core/components/ScreenKeyboardAwareScrollView";
import { Colors, Spacing, Typography } from "@/src/core/constants/theme";
import { TEST_CREDENTIALS } from "@/src/core/test/profileData";

type ResetPasswordScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "ResetPassword"
>;

export default function ResetPasswordScreen() {
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [shake, setShake] = useState(false);

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  }, []);

  const handleSend = () => {
    if (!email.trim()) {
      setError("Este campo no puede estar vacío");
      triggerShake();
      return;
    }

    if (email.toLowerCase() !== TEST_CREDENTIALS.email.toLowerCase()) {
      setError("No se encontró una cuenta con este correo");
      triggerShake();
      return;
    }

    setError(undefined);
    console.log("Reset password email sent");
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const clearError = () => {
    if (error) {
      setError(undefined);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenKeyboardAwareScrollView
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing["2xl"],
          },
        ]}
      >
        <Pressable testID="back-button" accessibilityRole="button" onPress={handleGoBack} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.light.text} />
        </Pressable>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Restablecer contraseña</Text>
          <Text style={styles.subtitle}>
            Ingresa tu dirección de correo electrónico para solicitar el
            restablecimiento de tu contraseña.
          </Text>

          <View style={styles.inputsContainer}>
            <AuthInput
              icon="mail"
              placeholder="abc@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                clearError();
              }}
              keyboardType="email-address"
              error={error}
              shake={shake}
            />

            <PrimaryButton title="ENVIAR" onPress={handleSend} />
          </View>
        </View>
      </ScreenKeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundRoot,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing["2xl"],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  formContainer: {
    width: "100%",
  },
  title: {
    ...Typography.h1,
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.light.textSecondary,
    marginBottom: Spacing["2xl"],
  },
  inputsContainer: {
    marginTop: Spacing.lg,
    alignItems: "center",
  },
});
