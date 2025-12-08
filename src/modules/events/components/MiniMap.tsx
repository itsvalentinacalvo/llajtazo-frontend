import React from "react";
import { View, StyleSheet, Pressable, Linking } from "react-native";
import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import { BorderRadius, Spacing } from "@/src/core/constants/theme";
import { Feather } from "@expo/vector-icons";

interface MiniMapProps {
  latitude: number;
  longitude: number;
  locationName: string;
  address: string;
}

export function MiniMap({ latitude, longitude, locationName, address }: MiniMapProps) {
  const { theme } = useTheme();

  const openInMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.mapPlaceholder, { backgroundColor: theme.backgroundSecondary }]}>
        <Feather name="map" size={32} color={theme.textSecondary} />
        <ThemedText style={[styles.placeholderText, { color: theme.textSecondary }]}>
          Vista de mapa disponible en la app
        </ThemedText>
        <Pressable
          style={[styles.openMapsButton, { backgroundColor: theme.primary }]}
          onPress={openInMaps}
        >
          <Feather name="external-link" size={14} color="#FFFFFF" />
          <ThemedText style={styles.openMapsText}>Abrir en Google Maps</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.sm,
  },
  mapPlaceholder: {
    height: 150,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  placeholderText: {
    fontSize: 13,
  },
  openMapsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xs,
    gap: 6,
    marginTop: Spacing.xs,
  },
  openMapsText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
