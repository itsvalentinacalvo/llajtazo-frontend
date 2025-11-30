import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/src/core/components/ThemedText";
import { Spacing } from "@/src/core/constants/theme";
import { useTheme } from "@/src/core/hooks/useTheme";

interface SectionHeaderLocationProps {
  title: string;
  location?: string;
  distance?: string;
  onLocationPress?: () => void;
}

export function SectionHeaderLocation({
  title,
  location,
  distance,
  onLocationPress,
}: SectionHeaderLocationProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      {location ? (
        <Pressable
          onPress={onLocationPress}
          style={({ pressed }) => [
            styles.locationButton,
            pressed && styles.pressed,
          ]}
        >
          <ThemedText style={[styles.locationText, { color: theme.textSecondary }]}>
            {location}
            {distance ? ` - ${distance}` : ""}
          </ThemedText>
          <Feather name="chevron-down" size={14} color={theme.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  locationText: {
    fontSize: 12,
    marginRight: 2,
  },
});
