import React from "react";
import { View, StyleSheet } from "react-native";

import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
} from "@/src/core/constants/theme";

interface TotalAmountCardProps {
  amount: number;
}

export function TotalAmountCard({ amount }: TotalAmountCardProps) {
  const { theme } = useTheme();

  const formattedAmount = `Bs. ${amount.toFixed(2).replace(".", ",")}`;

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
      <ThemedText style={[styles.amount, { color: theme.text }]}>
        {formattedAmount}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
  },
  amount: {
    fontSize: 24,
    fontWeight: "700",
  },
});
