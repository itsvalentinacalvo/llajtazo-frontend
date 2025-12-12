import React from "react";
import { View, StyleSheet, Pressable, Image, ImageSourcePropType, useWindowDimensions } from "react-native";
import { Feather, Octicons } from "@expo/vector-icons";
import { ThemedText } from "@/src/core/components/ThemedText";
import { BorderRadius, Spacing, Shadows, Colors } from "@/src/core/constants/theme";
import { useTheme } from "@/src/core/hooks/useTheme";
import { findEventById } from "@/src/core/data/events";

interface EventCardProps {
  eventId: string;
  isSaved?: boolean;
  onPress?: () => void;
  onBookmarkPress?: () => void;
}

export function EventCard({ eventId, isSaved = false, onPress, onBookmarkPress }: EventCardProps) {
  const event = findEventById(eventId);
  if (!event) return null;
  const { title, date, location, attendees = 0, image } = event;
  const dateObj: any = date;
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  
  const cardWidth = screenWidth < 350 ? 160 : screenWidth < 400 ? 170 : 180;
  const imageHeight = screenWidth < 350 ? 100 : 120;
  
  console.debug("[Core][EventCard] render", { title });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { width: cardWidth },
        Shadows.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        <Image source={image} style={styles.eventImage} resizeMode="cover" />
        {dateObj && typeof dateObj.day !== "undefined" && (
          <View style={styles.dateBadge}>
            <ThemedText style={styles.dateDay}>{dateObj.day}</ThemedText>
            <ThemedText style={styles.dateMonth}>{dateObj.month}</ThemedText>
          </View>
        )}
        <Pressable
          style={styles.bookmarkButton}
          onPress={(e) => {
            e.stopPropagation?.();
            onBookmarkPress?.();
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Octicons
            name="bookmark-filled"
            size={18}
            color={isSaved ? Colors.light.error : "#999999"}
            style={styles.bookmarkIcon}
          />
        </Pressable>
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
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  imageContainer: {
    width: "100%",
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
  bookmarkButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  bookmarkIcon: {
    transform: [{ scaleX:1.1 }],
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
    flex: 1,
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
