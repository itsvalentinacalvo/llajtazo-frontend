import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/src/core/components/ThemedText";
import { BorderRadius, Spacing } from "@/src/core/constants/theme";

interface Sector {
  id: string;
  name: string;
  color: string;
  textColor: string;
}

interface SectorMapProps {
  sectors: Sector[];
}

export function SectorMap({ sectors }: SectorMapProps) {
  return (
    <View style={styles.container}>
      {sectors.map((sector) => (
        <View
          key={sector.id}
          style={[
            styles.sectorButton,
            { backgroundColor: sector.color },
          ]}
        >
          <ThemedText
            style={[styles.sectorText, { color: sector.textColor }]}
          >
            {sector.name}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  sectorButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  sectorText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
