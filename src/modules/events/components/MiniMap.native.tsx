import React from "react";
import { View, StyleSheet, Platform, Pressable, Linking } from "react-native";
import MapView, { Marker } from "react-native-maps";
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
    // Always open Google Maps web URL so iOS doesn't route to Apple Maps.
    // This ensures behavior is consistent across platforms and opens
    // the Google Maps app only if the user has it and the OS chooses to handle it.
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.mapContainer, { backgroundColor: theme.backgroundSecondary }]}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          <Marker
            coordinate={{ latitude, longitude }}
            title={locationName}
          />
        </MapView>
        {latitude && longitude ? (
          <Pressable
            style={[styles.expandButton, { backgroundColor: theme.backgroundRoot }]}
            onPress={openInMaps}
          >
            <Feather name="external-link" size={16} color={theme.primary} />
            <ThemedText style={[styles.expandText, { color: theme.primary }]}>Abrir en Google Maps</ThemedText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.sm,
  },
  mapContainer: {
    height: 150,
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  expandButton: {
    position: "absolute",
    bottom: Spacing.sm,
    left: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.xs,
    gap: 6,
  },
  expandText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
