import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/src/core/components/ThemedText";
import { BorderRadius, Spacing } from "@/src/core/constants/theme";
import { useTheme } from "@/src/core/hooks/useTheme";

interface BuyTicketButtonProps {
  label?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function BuyTicketButton({
  label = "COMPRAR TICKET",
  onPress = () => {},
  style,
}: BuyTicketButtonProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.primary },
        style,
        pressed && styles.pressed,
      ]}
    >
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Feather name="arrow-right" size={18} color="#FFFFFF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
});
