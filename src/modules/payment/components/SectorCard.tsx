import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import {
  Colors,
  Spacing,
  BorderRadius,
  Shadows,
  Typography,
} from "@/src/core/constants/theme";

interface SectorCardProps {
  name: string;
  price: number;
  soldOut?: boolean;
  selected?: boolean;
  onPress: () => void;
}

export function SectorCard({
  name,
  price,
  soldOut = false,
  selected = false,
  onPress,
}: SectorCardProps) {
  const { theme } = useTheme();

  const formattedPrice = `Bs. ${price.toFixed(2).replace(".", ",")}`;

  return (
    <Pressable
      onPress={onPress}
      disabled={soldOut}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.white,
          borderColor: selected ? theme.primary : Colors.light.border,
          opacity: pressed && !soldOut ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.info}>
        <ThemedText
          style={[
            styles.name,
            soldOut && { color: Colors.light.textSecondary },
          ]}
        >
          {name}
        </ThemedText>
        <ThemedText
          style={[
            styles.price,
            selected && { color: theme.primary },
            soldOut && { color: Colors.light.textSecondary },
          ]}
        >
          {formattedPrice}
        </ThemedText>
      </View>

      {soldOut ? (
        <View style={styles.soldOutBadge}>
          <ThemedText style={styles.soldOutText}>SOLD OUT</ThemedText>
        </View>
      ) : selected ? (
        <View style={[styles.checkCircle, { backgroundColor: theme.primary }]}>
          <Feather name="check" size={18} color={theme.white} />
        </View>
      ) : (
        <View style={styles.emptyCircle} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    ...Shadows.card,
  },
  info: {
    flex: 1,
  },
  name: {
    ...Typography.body,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  price: {
    ...Typography.body,
    fontWeight: "700",
    color: Colors.light.textSecondary,
  },
  soldOutBadge: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  soldOutText: {
    ...Typography.small,
    color: Colors.light.white,
    fontWeight: "600",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
});
