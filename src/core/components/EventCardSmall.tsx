import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/src/core/components/ThemedText";
import { BorderRadius, Spacing, Shadows } from "@/src/core/constants/theme";
import { useTheme } from "@/src/core/hooks/useTheme";

const IMAGE_HEIGHT_RATIO = 0.79;
const CONTENT_HEIGHT = 60;

interface EventCardSmallProps {
  title: string;
  subtitle?: string;
  date: { day: string; month: string };
  location: string;
  image: ImageSourcePropType;
  cardWidth: number;
  noMargin?: boolean;
  onPress?: () => void;
}

export function EventCardSmall({
  title,
  subtitle,
  date,
  location,
  image,
  cardWidth,
  noMargin = false,
  onPress,
}: EventCardSmallProps) {
  const { theme } = useTheme();
  const imageHeight = cardWidth * IMAGE_HEIGHT_RATIO;
  console.debug("[Core][EventCardSmall] render", { title });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { width: cardWidth },
        noMargin && { marginBottom: 0 },
        Shadows.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.imageContainer, { height: imageHeight }]}>
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
          <ThemedText
            style={[styles.subtitle, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
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
          <ThemedText
            style={[styles.location, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {location}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  imageContainer: {
    width: "100%",
    borderTopLeftRadius: BorderRadius.md,
    borderTopRightRadius: BorderRadius.md,
    overflow: "hidden",
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
    height: CONTENT_HEIGHT,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  locationIcon: {
    marginRight: 3,
  },
  location: {
    fontSize: 11,
    flex: 1,
  },
});
