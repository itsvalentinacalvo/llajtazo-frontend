import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import { ThemedText } from "@/src/core/components/ThemedText";
import { Spacing, BorderRadius, Colors } from "@/src/core/constants/theme";

export type MiniMapPickerProps = {
  latitude?: number;
  longitude?: number;
  onChange: (lat: number, lng: number) => void;
};

export function MiniMapPicker({ latitude, longitude, onChange }: MiniMapPickerProps) {
  const [coord, setCoord] = useState<{ lat: number; lng: number } | null>(
    latitude != null && longitude != null ? { lat: latitude, lng: longitude } : null
  );

  const handlePress = (e: MapPressEvent) => {
    const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
    setCoord({ lat, lng });
    onChange(lat, lng);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coord?.lat || -17.7833,
          longitude: coord?.lng || -63.1821,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={handlePress}
      >
        {coord ? (
          <Marker coordinate={{ latitude: coord.lat, longitude: coord.lng }} />
        ) : null}
      </MapView>
      <View style={styles.footer}>
        {coord ? (
          <ThemedText style={styles.coordsText}>
            Lat: {coord.lat.toFixed(5)} | Lng: {coord.lng.toFixed(5)}
          </ThemedText>
        ) : (
          <ThemedText style={styles.coordsText}>Toca el mapa para seleccionar ubicación</ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  map: {
    width: "100%",
    height: 160,
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: "#FFFFFF",
  },
  coordsText: {
    fontSize: 12,
  },
});
