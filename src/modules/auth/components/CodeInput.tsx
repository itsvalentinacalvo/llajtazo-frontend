import { useRef, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Colors } from "@/src/core/constants/theme";

interface CodeInputProps {
  length?: number;
  onComplete?: (code: string) => void;
}

export default function CodeInput({ length = 4, onComplete }: CodeInputProps) {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<TextInput[]>([]);

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

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputsRef.current[index] = ref;
          }}
          style={styles.input}
          value={code[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 32,
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
});
