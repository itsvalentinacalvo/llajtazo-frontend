import React, { useState, useCallback, useRef } from "react";
import { useIsFocused } from "@react-navigation/native";
import { View, StyleSheet } from "react-native";
import { useHomeHeader } from "@/src/core/components/HomeHeaderContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/src/core/hooks/useTheme";
import { MapContainer, MapContainerRef } from "../components/MapContainer";
import { MapEventsCards } from "../components/MapEventsCards";
import { GoogleMapsButton } from "../components/GoogleMapsButton";
import { MAP_EVENTS, MapEvent, CATEGORY_CONFIG } from "../constants/mapEvents";
import { Spacing } from "@/src/core/constants/theme";

const TAB_BAR_HEIGHT = 70;

export default function MapaScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const mapRef = useRef<MapContainerRef>(null);
  const isFocused = useIsFocused();
  const { selectedCategory } = useHomeHeader();
  const [savedEvents, setSavedEvents] = useState<Set<string>>(
    new Set(MAP_EVENTS.filter((e) => e.isSaved).map((e) => e.id))
  );

  const filteredEvents = selectedCategory
    ? MAP_EVENTS.filter((e) => {
        const config = CATEGORY_CONFIG[e.category];
        return config.label.toLowerCase() === selectedCategory.toLowerCase();
      }).map((e) => ({ ...e, isSaved: savedEvents.has(e.id) }))
    : MAP_EVENTS.map((e) => ({ ...e, isSaved: savedEvents.has(e.id) }));

  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(
    filteredEvents.length > 0 ? filteredEvents[0] : null
  );

  console.debug("[Home][MapaScreen] render", { selectedEventId: selectedEvent?.id });

  const handleEventChange = useCallback((event: MapEvent) => {
    setSelectedEvent(event);
  }, []);

  const handleMarkerSelect = useCallback((event: MapEvent) => {
    setSelectedEvent(event);
  }, []);

  const handleBookmarkToggle = useCallback((eventId: string) => {
    setSavedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  }, []);

  const bottomInset = insets.bottom > 0 ? insets.bottom : 16;
  const cardsBottomOffset = TAB_BAR_HEIGHT + bottomInset;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <StatusBar style="light" />

      <View style={styles.mapWrapper}>
        {isFocused ? (
          <MapContainer
            ref={mapRef}
            events={filteredEvents}
            selectedEventId={selectedEvent?.id}
            onSelectEvent={handleMarkerSelect}
          />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.backgroundDefault }]} />
        )}

        {selectedEvent && (
          <View style={[styles.googleMapsContainer, { bottom: cardsBottomOffset + Spacing.md + 129 }]}>
            <GoogleMapsButton
              latitude={selectedEvent.coordinate.latitude}
              longitude={selectedEvent.coordinate.longitude}
            />
          </View>
        )}

        <MapEventsCards
          events={filteredEvents}
          selectedEventId={selectedEvent?.id}
          onEventChange={handleEventChange}
          onBookmarkToggle={handleBookmarkToggle}
          bottomInset={cardsBottomOffset + 4}
        />
      </View>

      {/* Header rendered by the Tab Navigator (CoreHeader) */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  mapWrapper: {
    flex: 1,
  },
  googleMapsContainer: {
    position: "absolute",
    left: Spacing.lg,
    zIndex: 15,
  },
});
