import { useRef, useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Text, Animated } from "react-native";
import { Colors } from "@/src/core/constants/theme";

interface CodeInputProps {
  length?: number;
  onComplete?: (code: string) => void;
  error?: string;
  shake?: boolean;
  onCodeChange?: (code: string) => void;
}

export default function CodeInput({ 
  length = 4, 
  onComplete, 
  error,
  shake = false,
  onCodeChange,
}: CodeInputProps) {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<TextInput[]>([]);
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

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    }

    if (!/^\d*$/.test(text)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    const fullCode = newCode.join("");
    onCodeChange?.(fullCode);

    if (text && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== "")) {
      onComplete?.(newCode.join(""));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const hasError = !!error;

  return (
    <View style={styles.wrapper}>
      <Animated.View 
        style={[
          styles.container,
          { transform: [{ translateX: shakeAnimation }] }
        ]}
      >
        {Array.from({ length }).map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputsRef.current[index] = ref;
            }}
            style={[styles.input, hasError && styles.inputError]}
            value={code[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </Animated.View>
      {hasError ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 32,
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  input: {
    width: 60,
    height: 60,
    backgroundColor: Colors.light.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder,
    fontSize: 24,
    fontWeight: "600",
    color: Colors.light.text,
    textAlign: "center",
  },
  inputError: {
    borderColor: "#FF5757",
    borderWidth: 1.5,
    color: "#FF5757",
  },
  errorText: {
    color: "#FF5757",
    fontSize: 12,
    marginTop: 12,
    textAlign: "center",
  },
});
