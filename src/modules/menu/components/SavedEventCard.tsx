import React from "react";
import { View, StyleSheet, Pressable, ImageSourcePropType } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ThemedText } from "@/src/core/components/ThemedText";
import { BorderRadius, Spacing, Shadows, Colors } from "@/src/core/constants/theme";

interface SavedEventCardProps {
  title: string;
  dateTime: string;
  location?: string;
  image: ImageSourcePropType;
  backgroundColor?: string;
  onPress?: () => void;
  disabled?: boolean;
}

export function SavedEventCard({
  title,
  dateTime,
  location,
  image,
  backgroundColor = "#FFFFFF",
  onPress,
  disabled = false,
}: SavedEventCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor },
        Shadows.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={image}
          style={[styles.eventImage, disabled && styles.eventImageDisabled]}
          contentFit="cover"
        />
      </View>
      <View style={styles.content}>
        <ThemedText style={[styles.dateTime, disabled && styles.dateTimeDisabled]}>{dateTime}</ThemedText>
        <ThemedText style={[styles.title, disabled && styles.titleDisabled]} numberOfLines={3}>
          {title}
        </ThemedText>

        {location ? (
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={12} color={Colors.light.textSecondary} style={styles.locationIcon} />
            <ThemedText style={[styles.location, disabled && styles.titleDisabled]} numberOfLines={1}>
              {location}
            </ThemedText>
          </View>
        ) : null}
      </View>
      {disabled && <View pointerEvents="none" style={styles.disabledOverlay} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  pressed: {
    opacity: 0.8,
  },
  imageContainer: {
    width: 92,
    height: 92,
    borderRadius: 10,
    overflow: "hidden",
    margin: 10,
    marginRight: 18,
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingRight: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  dateTime: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.light.primary,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
  },
  dateTimeDisabled: {
    color: "rgba(18,13,38,0.45)",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#120D26",
  },
  titleDisabled: {
    color: "rgba(18,13,38,0.45)",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  locationIcon: {
    marginRight: 6,
  },
  location: {
    fontSize: 11,
    color: "#888888",
    flex: 1,
  },
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(130,130,130,0.20)",
    borderRadius: BorderRadius.lg,
  },
  eventImageDisabled: {
    opacity: 0.4,
  },
});
