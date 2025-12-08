import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  ImageSourcePropType,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import { BorderRadius, Spacing, Shadows } from "@/src/core/constants/theme";

interface TicketCardProps {
  id: string;
  title: string;
  venue: string;
  image: ImageSourcePropType;
  ticketCount: number;
  onPress?: () => void;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TicketCard({
  id,
  title,
  venue,
  image,
  ticketCount,
  onPress,
}: TicketCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, animatedStyle]}
    >
      <View style={styles.shadowWrapper}>
        <View style={styles.shadow} />
      </View>

      <View style={[styles.card, { borderColor: theme.border }]}>
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.eventImage} resizeMode="cover" />
        </View>

        <View style={styles.content}>
          <View style={styles.textContainer}>
            <ThemedText style={styles.title} numberOfLines={1}>
              {title}
            </ThemedText>
            <View style={styles.venueRow}>
              <Feather
                name="map-pin"
                size={12}
                color={theme.textSecondary}
                style={styles.venueIcon}
              />
              <ThemedText
                style={[styles.venue, { color: theme.textSecondary }]}
                numberOfLines={1}
              >
                {venue}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.ticketBadge, { backgroundColor: theme.primary }]}>
            <Ionicons name="ticket-outline" size={14} color={theme.white} />
            <ThemedText style={[styles.ticketCount, { color: theme.white }]}>
              {ticketCount}
            </ThemedText>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
    position: "relative",
  },
  shadowWrapper: {
    position: "absolute",
    bottom: 68,
    left: 32,
    right: 32,
    height: 60,
    alignItems: "center",
  },
  shadow: {
    width: 251,
    height: 60,
    backgroundColor: "#7952FC",
    opacity: 0.4,
    borderRadius: 12,
    ...StyleSheet.flatten({
      shadowColor: "#7952FC",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
    }),
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
    ...Shadows.card,
  },
  imageContainer: {
    width: "100%",
    height: 175,
    borderTopLeftRadius: BorderRadius.lg - 1,
    borderTopRightRadius: BorderRadius.lg - 1,
    overflow: "hidden",
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#13123A",
    marginBottom: 2,
  },
  venueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  venueIcon: {
    marginRight: 4,
    opacity: 0.5,
  },
  venue: {
    fontSize: 12,
    opacity: 0.5,
  },
  ticketBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  ticketCount: {
    fontSize: 14,
    fontWeight: "600",
  },
});
