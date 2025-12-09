import React from "react";
import { View, StyleSheet } from "react-native";

import { ThemedText } from "@/src/core/components/ThemedText";
import { Colors, Spacing, Typography } from "@/src/core/constants/theme";

interface PriceSummaryProps {
  subtotal: number;
  serviceFee: number;
  total: number;
}

export function PriceSummary({
  subtotal,
  serviceFee,
  total,
}: PriceSummaryProps) {
  const formatPrice = (value: number) =>
    `Bs. ${value.toFixed(2).replace(".", ",")}`;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ThemedText style={styles.label}>Subtotal</ThemedText>
        <ThemedText style={styles.value}>{formatPrice(subtotal)}</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText style={styles.label}>Cargo por Servicio</ThemedText>
        <ThemedText style={styles.value}>{formatPrice(serviceFee)}</ThemedText>
      </View>
      <View style={[styles.row, styles.totalRow]}>
        <ThemedText style={styles.totalLabel}>Total</ThemedText>
        <ThemedText style={styles.totalValue}>{formatPrice(total)}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  label: {
    ...Typography.body,
    color: Colors.light.textSecondary,
  },
  value: {
    ...Typography.body,
    fontWeight: "500",
  },
  totalRow: {
    marginTop: Spacing.sm,
    marginBottom: 0,
  },
  totalLabel: {
    ...Typography.h4,
    fontWeight: "600",
  },
  totalValue: {
    ...Typography.h4,
    fontWeight: "700",
  },
});
