import React, { forwardRef, useImperativeHandle } from "react";
import { View, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { ThemedText } from "@/src/core/components/ThemedText";
import { Colors, Spacing, BorderRadius, Shadows } from "@/src/core/constants/theme";
import { CATEGORY_CONFIG } from "../../constants/mapEvents";
import { MapContainerRef, MapContainerProps } from "./types";

export const MapContainer = forwardRef<MapContainerRef, MapContainerProps>(
  function MapContainer({ events, selectedEventId, onSelectEvent }, ref) {
    useImperativeHandle(ref, () => ({
      animateToEvent: () => {},
    }));

    console.debug("[Home][MapContainer:web] render", { eventsLength: events?.length, selectedEventId });

    return (
      <View style={styles.webFallback}>
        <View style={styles.webHeader}>
          <Feather name="map" size={48} color={Colors.light.textSecondary} />
          <ThemedText style={styles.webTitle}>
            Abre en Expo Go para ver el mapa
          </ThemedText>
        </View>
        <ScrollView
          style={styles.eventList}
          contentContainerStyle={styles.eventListContent}
          showsVerticalScrollIndicator={false}
        >
          {events.map((event) => {
            const config = CATEGORY_CONFIG[event.category];
            return (
              <Pressable
                key={event.id}
                style={[
                  styles.eventItem,
                  selectedEventId === event.id && styles.eventItemSelected,
                ]}
                onPress={() => onSelectEvent(event)}
              >
                <Image source={event.image} style={styles.eventItemImage} />
                <View style={styles.eventItemInfo}>
                  <View style={styles.categoryBadge}>
                    <View
                      style={[styles.categoryDot, { backgroundColor: config.color }]}
                    />
                    <ThemedText style={styles.categoryText}>
                      {config.label}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.eventItemDate}>
                    {event.date} - {event.time}
                  </ThemedText>
                  <ThemedText style={styles.eventItemTitle} numberOfLines={1}>
                    {event.title}
                  </ThemedText>
                  <View style={styles.locationRow}>
                    <FontAwesome6
                      name="location-dot"
                      size={12}
                      color={Colors.light.primary}
                    />
                    <ThemedText style={styles.locationText}>
                      {event.location}
                    </ThemedText>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  webFallback: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  webHeader: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  webTitle: {
    marginTop: Spacing.md,
    color: Colors.light.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
  eventList: {
    flex: 1,
  },
  eventListContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  eventItem: {
    flexDirection: "row",
    backgroundColor: Colors.light.white,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    ...Shadows.card,
  },
  eventItemSelected: {
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  eventItemImage: {
    width: 70,
    height: 90,
    borderRadius: BorderRadius.sm,
  },
  eventItemInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: "center",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  eventItemDate: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: "500",
    marginBottom: 4,
  },
  eventItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginLeft: 4,
  },
});
