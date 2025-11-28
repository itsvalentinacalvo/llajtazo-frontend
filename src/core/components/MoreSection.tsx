import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/src/core/components/ThemedText";
import { Spacing, Typography } from "@/src/core/constants/theme";
import { useTheme } from "@/src/core/hooks/useTheme";

interface SectionHeaderProps {
  title: string;
  onSeeMore?: () => void;
}

export function SectionHeader({ title, onSeeMore }: SectionHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      {onSeeMore && (
        <Pressable
          onPress={onSeeMore}
          style={({ pressed }) => [styles.seeMore, pressed && styles.pressed]}
        >
          <ThemedText style={[styles.seeMoreText, { color: theme.textSecondary }]}>
            Más
          </ThemedText>
          <Feather name="chevron-right" size={16} color={theme.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.sectionHeading,
    color: "#1A1A1A",
  },
  seeMore: {
    flexDirection: "row",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.5,
  },
  seeMoreText: {
    fontSize: 13,
    fontWeight: "400",
    marginRight: 4,
  },
});
