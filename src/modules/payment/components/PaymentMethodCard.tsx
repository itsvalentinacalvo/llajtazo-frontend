import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import {
  Colors,
  Spacing,
  BorderRadius,
  Shadows,
  Typography,
} from "@/src/core/constants/theme";

interface PaymentMethodCardProps {
  type: "qr" | "card";
  title: string;
  subtitle: string;
  selected?: boolean;
  onPress: () => void;
}

export function PaymentMethodCard({
  type,
  title,
  subtitle,
  selected = false,
  onPress,
}: PaymentMethodCardProps) {
  const { theme } = useTheme();

  const renderIcon = () => {
    if (type === "qr") {
      return (
        <View style={styles.qrIconContainer}>
          <MaterialCommunityIcons name="qrcode-scan" size={29} color={theme.text} />
        </View>
      );
    }
    return (
      <View style={styles.qrIconContainer}>
        <FontAwesome6 name="credit-card" size={24} color="#000000" />
      </View>
    );
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.white,
          borderColor: selected ? theme.primary : Colors.light.border,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.content}>
        {renderIcon()}
        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        </View>
      </View>

      {selected ? (
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
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  qrIconContainer: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconsContainer: {
    flexDirection: "row",
    gap: Spacing.xs,
    width: 58,
  },
  cardBrandContainer: {
    flexDirection: "row",
    gap: Spacing.xs,
    alignItems: "center",
  },
  visaContainer: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.white,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  mastercardContainer: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.white,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  masterCircle: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  textContainer: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  title: {
    ...Typography.h4,
    fontWeight: "500",
    marginBottom: 4,
    fontSize: 17,
  },
  subtitle: {
    ...Typography.small,
    color: Colors.light.textSecondary,
    fontSize: 12,
    fontWeight: "500",
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
