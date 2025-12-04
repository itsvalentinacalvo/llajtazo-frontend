import React from "react";
import { StyleSheet, Pressable, Linking } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/src/core/components/ThemedText";
import { Colors, Spacing, BorderRadius, Shadows } from "@/src/core/constants/theme";

const googleLogo = require("@/src/core/assets/google-logo (copy).png");

interface GoogleMapsButtonProps {
  latitude: number;
  longitude: number;
}

export function GoogleMapsButton({ latitude, longitude }: GoogleMapsButtonProps) {
  console.debug("[Home][GoogleMapsButton] render", { latitude, longitude });

  const handlePress = () => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    console.debug("[Home][GoogleMapsButton] opening url", url);
    Linking.openURL(url);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onPress={handlePress}
    >
      <Image
        source={googleLogo}
        style={styles.googleLogo}
        contentFit="contain"
      />
      <ThemedText style={styles.text}>GOOGLE MAPS</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    alignSelf: "flex-start",
    ...Shadows.card,
  },
  containerPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  googleLogo: {
    width: 20,
    height: 20,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.primary,
    letterSpacing: 0.5,
  },
});
