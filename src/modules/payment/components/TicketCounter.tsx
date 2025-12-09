import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
} from "@/src/core/constants/theme";

interface TicketCounterProps {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function TicketCounter({
  count,
  onIncrement,
  onDecrement,
}: TicketCounterProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.white,
          borderColor: theme.primary,
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name="ticket-outline"
          size={24}
          color={theme.primary}
          style={styles.icon}
        />
        <ThemedText style={styles.count}>{count}</ThemedText>
      </View>
      <View style={styles.controls}>
        <Pressable
          onPress={onDecrement}
          style={({ pressed }) => [
            styles.controlButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="remove" size={24} color={theme.primary} />
        </Pressable>
        <View style={styles.divider} />
        <Pressable
          onPress={onIncrement}
          style={({ pressed }) => [
            styles.controlButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="add" size={24} color={theme.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.xs,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: Spacing.md,
  },
  count: {
    ...Typography.body,
    fontWeight: "600",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  controlButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.xs,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.light.border,
  },
});
