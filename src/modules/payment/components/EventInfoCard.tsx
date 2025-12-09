import React from "react";
import { View, StyleSheet } from "react-native";
import { Image, ImageSource } from "expo-image";

import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import {
  Colors,
  Spacing,
  BorderRadius,
  Shadows,
  Typography,
} from "@/src/core/constants/theme";

interface EventInfoCardProps {
  imageSource: ImageSource;
  title: string;
  date: string;
  location: string;
}

export function EventInfoCard({
  imageSource,
  title,
  date,
  location,
}: EventInfoCardProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <Image source={imageSource} style={styles.image} contentFit="cover" />
      <View style={styles.info}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={[styles.subtitle, styles.subtitleFirst]}>{date}</ThemedText>
        <ThemedText style={styles.subtitle}>{location}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    ...Shadows.card,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xs,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.lg,
    justifyContent: "center",
  },
  title: {
    ...Typography.eventTitle,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.small,
    color: Colors.light.textSecondary,
    fontWeight: "500",
  },
  subtitleFirst: {
    marginBottom: Spacing.xs,
  },
});
