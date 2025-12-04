import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { AuthStackParamList } from "@/src/modules/auth/navigation/AuthNavigator";
import CodeInput from "@/src/modules/auth/components/CodeInput";
import { ScreenKeyboardAwareScrollView } from "@/src/core/components/ScreenKeyboardAwareScrollView";
import { Colors, Spacing, Typography } from "@/src/core/constants/theme";
import PrimaryButton from "@/src/modules/auth/components/PrimaryButton";
import { TEST_CREDENTIALS } from "@/src/core/test/profileData";

type VerificationScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Verification"
>;

type VerificationScreenRouteProp = RouteProp<AuthStackParamList, "Verification">;

export default function VerificationScreen() {
  const navigation = useNavigation<VerificationScreenNavigationProp>();
  const route = useRoute<VerificationScreenRouteProp>();
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(20);
  const [error, setError] = useState<string | undefined>(undefined);
  const [shake, setShake] = useState(false);

  const userEmail = route.params?.email || "abc@email.com";

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  }, []);

  const handleContinue = () => {
    if (code.length < 4) {
      setError("Debes ingresar el código completo");
      triggerShake();
      return;
    }

    if (code !== TEST_CREDENTIALS.verificationCode) {
      setError("El código ingresado es incorrecto");
      triggerShake();
      return;
    }

    setError(undefined);
    navigation.navigate("Interests");
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(20);
      setError(undefined);
      console.log("Resend code");
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
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
          <Text style={styles.title}>Verificación</Text>
          <Text style={styles.subtitle}>
            Te enviamos un código al correo{"\n"}{userEmail}
          </Text>

          <CodeInput 
            length={4} 
            onComplete={setCode} 
            onCodeChange={handleCodeChange}
            error={error}
            shake={shake}
          />

          <PrimaryButton
            title="CONTINUAR"
            onPress={handleContinue}
            disabled={code.length < 4}
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Reenviar código en </Text>
            {timer === 0 ? (
              <Pressable onPress={handleResend} accessibilityRole="button">
                <Text style={[styles.resendTimer, styles.resendTimerActive]}>
                  Reenviar
                </Text>
              </Pressable>
            ) : (
              <Text style={styles.resendTimer}>{formatTime(timer)}</Text>
            )}
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
    alignItems: "center",
  },
  title: {
    ...Typography.h1,
    color: Colors.light.text,
    marginBottom: Spacing.md,
    alignSelf: "flex-start",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
    alignSelf: "flex-start",
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  resendText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  resendTimer: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "600",
  },
  resendTimerActive: {
    textDecorationLine: "underline",
    color: "#2BBBFF",
  },
});
