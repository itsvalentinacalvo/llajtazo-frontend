import React from "react";
import { View, StyleSheet, Pressable, Image, ImageSourcePropType } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Spacing, Typography, Shadows } from "@/src/core/constants/theme";
import { useTheme } from "@/hooks/useTheme";

interface EventCardProps {
  title: string;
  date: { day: string; month: string };
  location: string;
  attendees: number;
  image: ImageSourcePropType;
  onPress?: () => void;
}

export function EventCard({
  title,
  date,
  location,
  attendees,
  image,
  onPress,
}: EventCardProps) {
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
        <ThemedText style={styles.title} numberOfLines={2}>
          {title}
        </ThemedText>

        <View style={styles.attendeesRow}>
          <View style={styles.avatarStack}>
            {[0, 1, 2].map((index) => (
              <View
                key={index}
                style={[
                  styles.avatar,
                  { backgroundColor: theme.primary, borderColor: theme.white },
                  index > 0 && styles.avatarOverlap,
                ]}
              />
            ))}
          </View>
          <ThemedText style={[styles.attendeesCount, { color: theme.primary }]}>
            +{attendees} Irán
          </ThemedText>
        </View>

        <View style={styles.locationRow}>
          <Feather
            name="map-pin"
            size={12}
            color={theme.textSecondary}
            style={styles.locationIcon}
          />
          <ThemedText style={[styles.location, { color: theme.textSecondary }]}>
            {location}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 180,
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  imageContainer: {
    width: "100%",
    height: 120,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    minWidth: 40,
    alignItems: "center",
  },
  dateDay: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF5757",
    textAlign: "center",
    lineHeight: 20,
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FF5757",
    textTransform: "uppercase",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    marginRight: 4,
  },
  location: {
    fontSize: 11,
    color: "#888888",
  },
  attendeesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  avatarStack: {
    flexDirection: "row",
    marginRight: Spacing.sm,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  attendeesCount: {
    fontSize: 11,
    fontWeight: "500",
  },
});
