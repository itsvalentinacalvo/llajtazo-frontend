import React from "react";
import { View, StyleSheet, Pressable, Image, ImageSourcePropType, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Spacing, Shadows } from "@/src/core/constants/theme";
import { useTheme } from "@/src/core/hooks/useTheme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.xl * 2 - Spacing.md) / 2;

interface EventCardSmallProps {
  title: string;
  subtitle?: string;
  date: { day: string; month: string };
  location: string;
  image: ImageSourcePropType;
  onPress?: () => void;
}

export function EventCardSmall({
  title,
  subtitle,
  date,
  location,
  image,
  onPress,
}: EventCardSmallProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        Shadows.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.eventImage} resizeMode="cover" />
        <View style={styles.dateBadge}>
          <ThemedText style={styles.dateDay}>{date.day}</ThemedText>
          <ThemedText style={styles.dateMonth}>{date.month}</ThemedText>
        </View>
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.title} numberOfLines={1}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
            {subtitle}
          </ThemedText>
        ) : null}
        <View style={styles.locationRow}>
          <Feather
            name="map-pin"
            size={10}
            color={theme.textSecondary}
            style={styles.locationIcon}
          />
          <ThemedText style={[styles.location, { color: theme.textSecondary }]} numberOfLines={1}>
            {location}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  imageContainer: {
    width: "100%",
    height: 130,
    borderTopLeftRadius: BorderRadius.md,
    borderTopRightRadius: BorderRadius.md,
    overflow: 'hidden',
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  dateBadge: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    minWidth: 28,
    alignItems: "center",
  },
  dateDay: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FF5757",
    textAlign: "center",
    lineHeight: 14,
  },
  dateMonth: {
    fontSize: 7,
    fontWeight: "600",
    color: "#FF5757",
    textTransform: "uppercase",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  content: {
    padding: Spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    marginRight: 3,
  },
  location: {
    fontSize: 11,
    flex: 1,
  },
});
