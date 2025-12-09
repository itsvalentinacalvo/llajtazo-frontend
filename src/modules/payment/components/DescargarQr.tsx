import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface Props {
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function DescargarQr({ onPress, style, textStyle }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
    >
      <Text style={[styles.label, textStyle]}>DESCARGAR QR</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 176,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(43,187,255,0.14)", // slightly stronger tint
    alignItems: "center",
    justifyContent: "center",
    // shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    // elevation for Android
    elevation: 3,
  },
  pressed: {
    opacity: 0.9,
  },
  label: {
    color: "#2bbbff",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "700",
  },
});
