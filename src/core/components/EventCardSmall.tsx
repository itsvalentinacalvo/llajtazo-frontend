import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  ImageSourcePropType,
  useWindowDimensions,
} from "react-native";
import { Feather, Octicons } from "@expo/vector-icons";
import { ThemedText } from "@/src/core/components/ThemedText";
import { BorderRadius, Spacing, Shadows, Colors } from "@/src/core/constants/theme";
import { useTheme } from "@/src/core/hooks/useTheme";
import { findEventById } from "@/src/core/test/events";

const IMAGE_HEIGHT_RATIO = 0.79;

interface EventCardSmallProps {
  eventId: string;
  cardWidth: number;
  noMargin?: boolean;
  isSaved?: boolean;
  showBookmark?: boolean;
  onPress?: () => void;
  onBookmarkPress?: () => void;
}

export function EventCardSmall({ eventId, cardWidth, noMargin = false, isSaved = false, showBookmark = true, onPress, onBookmarkPress }: EventCardSmallProps) {
  const event = findEventById(eventId);
  if (!event) return null;
  const { title, subtitle, date, location, image } = event as any;
  const dateObj: any = date;
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const imageHeight = cardWidth * IMAGE_HEIGHT_RATIO;
  
  const isSmallScreen = screenWidth < 350;
  const baseContentHeight = isSmallScreen ? 48 : 56;
  const contentHeightWithSubtitle = isSmallScreen ? 64 : 74;
  const contentHeight = subtitle ? contentHeightWithSubtitle : baseContentHeight;
  const titleFontSize = isSmallScreen ? 12 : 14;
  const subtitleFontSize = isSmallScreen ? 10 : 12;
  const locationFontSize = isSmallScreen ? 9 : 11;
  const bookmarkSize = isSmallScreen ? 14 : 16;
  const bookmarkButtonSize = isSmallScreen ? 24 : 28;

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
        {dateObj && typeof dateObj.day !== "undefined" && (
          <View style={styles.dateBadge}>
            <ThemedText style={styles.dateDay}>{dateObj.day}</ThemedText>
            <ThemedText style={styles.dateMonth}>{dateObj.month}</ThemedText>
          </View>
        )}
        {showBookmark ? (
          <Pressable
            style={[styles.bookmarkButton, { width: bookmarkButtonSize, height: bookmarkButtonSize }]}
            onPress={(e) => {
              e.stopPropagation?.();
              onBookmarkPress?.();
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Octicons
              name="bookmark-filled"
              size={bookmarkSize}
              color={isSaved ? Colors.light.error : "#a0a0a0ff"}
              style={styles.bookmarkIcon}
            />
          </Pressable>
        ) : null}
      </View>

      <View style={[styles.content, { height: contentHeight, padding: isSmallScreen ? Spacing.xs : Spacing.sm }]}>
        <ThemedText style={[styles.title, { fontSize: titleFontSize }]} numberOfLines={1}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText
            style={[styles.subtitle, { color: theme.textSecondary, fontSize: subtitleFontSize }]}
            numberOfLines={1}
          >
            {subtitle}
          </ThemedText>
        ) : null}
        <View style={styles.locationRow}>
          <Feather
            name="map-pin"
            size={isSmallScreen ? 8 : 10}
            color={theme.textSecondary}
            style={styles.locationIcon}
          />
          <ThemedText
            style={[styles.location, { color: theme.textSecondary, fontSize: locationFontSize }]}
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    minWidth: 28,
    alignItems: "center",
  },
  dateDay: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF5757",
    textAlign: "center",
    lineHeight: 16,
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FF5757",
    textTransform: "uppercase",
    textAlign: "center",
    letterSpacing: 0.2,
  },
 bookmarkButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  bookmarkIcon: {
    transform: [{ scaleX:1.1 }],
  },
  content: {
    justifyContent: "center",
  },
  title: {
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  subtitle: {
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
    flex: 1,
  },
});
