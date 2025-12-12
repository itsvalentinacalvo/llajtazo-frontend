import React, { useMemo } from "react";
import { View, StyleSheet, ImageSourcePropType, useWindowDimensions } from "react-native";
import { SponsoredEventCard } from "./SponsoredEventCard";
import { Spacing } from "@/src/core/constants/theme";
import { useTheme } from "@/src/core/hooks/useTheme";

const GRID_GAP = Spacing.md;
const HORIZONTAL_PADDING = Spacing.xl;

interface SponsoredRowProps {
  events: [string, string?];
  onEventPress?: (eventId: string) => void;
}

export function SponsoredRow({ events, onEventPress }: SponsoredRowProps) {
  const { theme } = useTheme();
  console.debug("[Home][SponsoredRow] render", { eventsCount: events?.length });
  const { width: screenWidth } = useWindowDimensions();

  const cardWidth = useMemo(() => {
    return (screenWidth - HORIZONTAL_PADDING * 2 - GRID_GAP) / 2;
  }, [screenWidth]);

  return (
    <View style={styles.container}>
      <View style={styles.topSpacer} />
      <View style={[styles.divider, { backgroundColor: theme.border }]} />
      <View style={styles.innerSpacer} />
      
      <View style={styles.row}>
        {events.map((eventId, index) =>
          eventId ? (
            <SponsoredEventCard
              key={eventId}
              eventId={eventId}
              cardWidth={cardWidth}
              onPress={() => onEventPress?.(eventId)}
            />
          ) : (
            <View key={`empty-${index}`} style={{ width: cardWidth }} />
          )
        )}
      </View>

      <View style={styles.innerSpacer} />
      <View style={[styles.divider, { backgroundColor: theme.border }]} />
      <View style={styles.bottomSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: Spacing.xl,
  },
  topSpacer: {
    height: Spacing.md,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
  innerSpacer: {
    height: Spacing.lg,
  },
  divider: {
    height: 2,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
