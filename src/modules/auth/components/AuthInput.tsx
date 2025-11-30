import { useState, useEffect, useRef } from "react";
import { View, TextInput, StyleSheet, Pressable, Text, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/src/core/constants/theme";

interface AuthInputProps {
  icon: keyof typeof Feather.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
  error?: string;
  shake?: boolean;
}

export default function AuthInput({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  error,
  shake = false,
}: AuthInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = secureTextEntry;
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shake) {
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [shake, shakeAnimation]);

  const hasError = !!error;

  return (
    <View style={styles.wrapper}>
      <Animated.View 
        style={[
          styles.container, 
          hasError && styles.containerError,
          { transform: [{ translateX: shakeAnimation }] }
        ]}
      >
        <Feather 
          name={icon} 
          size={22} 
          color={hasError ? "#FF5757" : Colors.light.textSecondary} 
          style={styles.icon} 
        />
        <TextInput
          style={[styles.input, hasError && styles.inputError]}
          placeholder={placeholder}
          placeholderTextColor={hasError ? "#FF5757" : Colors.light.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
        {isPassword ? (
          <Pressable
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
          >
            <Feather
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={20}
              color={hasError ? "#FF5757" : Colors.light.textSecondary}
            />
          </Pressable>
        ) : null}
      </Animated.View>
      {hasError ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 16,
  },
  container: {
    width: "100%",
    height: 56,
    backgroundColor: Colors.light.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  containerError: {
    borderColor: "#FF5757",
    borderWidth: 1.5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    height: "100%",
  },
  inputError: {
    color: "#FF5757",
  },
  eyeIcon: {
    padding: 5,
  },
  errorText: {
    color: "#FF5757",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});
